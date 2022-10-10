import mongoose from "mongoose";
import request from "supertest";
import App from "@/app";
import userModel from "@models/users.model";
import { User } from "@interfaces/users.interface";
import { CarbonCertificate, CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";
import carbonCertificatesModel from "@models/carbonCertificates.model";
import CarbonCertificatesRoute from "@routes/carbonCertificates.route";
import AuthService from "../services/auth.service";
import { hash } from "bcrypt";
import CarbonCertificatesService from "../services/carbonCertificates.service";

describe("Testing carbon certificates", () => {
  let carbonCertificatesRoute;
  let app;
  let server;
  let authService;
  let carbonCertificatesService;

  beforeAll(async () => {
    carbonCertificatesRoute = new CarbonCertificatesRoute();
    app = new App([carbonCertificatesRoute]);
    server = app.getServer();
    authService = new AuthService();
    carbonCertificatesService = new CarbonCertificatesService();

    // Clear up DB in case of broken tests
    await carbonCertificatesModel.deleteMany({});
    await userModel.deleteMany({});

    const countries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain"];
    const usersData = [];
    let userCounter = 0;

    while (userCounter < 10) {
      const user: User = {
        email: `jest_test_user_${userCounter + 1}@testing.com`,
        password: await hash("123", 10)
      };

      usersData.push(user);

      userCounter++;
    }
    const users = await userModel.insertMany(usersData);
    const userIdsWithCertificates = users.slice(0, 5);

    const certificatesData = [];
    let certificatesCounter = 0;
    while (certificatesCounter < 100) {
      const certificate: CarbonCertificate = {
        country: countries[Math.floor(Math.random() * countries.length)],
        status: CarbonCertificateStatus.available
      };

      if (certificatesCounter < userIdsWithCertificates.length) {
        certificate.owner = userIdsWithCertificates[certificatesCounter]._id;
        certificate.status = CarbonCertificateStatus.owned;
      }

      certificatesData.push(certificate);

      certificatesCounter++;
    }

    await carbonCertificatesModel.insertMany(certificatesData);
  });

  afterAll(async () => {
    await carbonCertificatesModel.deleteMany({});
    await userModel.deleteMany({});
    await mongoose.connection.close();
  });

  describe(`[GET] /carbon-certificates`, () => {
    it("response should include only available certificates", async () => {
      const carbonCertificatesRoute = new CarbonCertificatesRoute();

      const res = await request(server).get(carbonCertificatesRoute.path);

      expect(res.status).toBe(200);

      const { data: certificates } = res.body;
      const hasOnlyAvailable = certificates.every(certificate => certificate.status === CarbonCertificateStatus.available);

      expect(certificates.length).toBe(95);
      expect(hasOnlyAvailable).toBe(true);
    });
  });

  describe(`[GET] /carbon-certificates/my`, () => {
    it("response return only the certificates that belong to the current user", async () => {
      const carbonCertificatesRoute = new CarbonCertificatesRoute();
      const user: User = await userModel.findOne({ email: "jest_test_user_1@testing.com" });

      const { cookie } = await authService.login({ email: user.email, password: "123" });
      const res = await request(server).get(`${carbonCertificatesRoute.path}/my`)
        .set("Cookie", cookie);

      expect(res.status).toBe(200);

      const { data: certificates } = res.body;
      const hasOnlyOwned = certificates.every(certificate => {
        return certificate.status === CarbonCertificateStatus.owned && certificate.owner.toString() === user._id.toString();
      });

      expect(certificates.length).toBe(1);
      expect(hasOnlyOwned).toBe(true);
    });
  });

  describe(`[GET] /carbon-certificates/:id/transfer`, () => {
    it("should transfer the certificate to another user", async () => {
      const carbonCertificatesRoute = new CarbonCertificatesRoute();
      const userFrom: User = await userModel.findOne({ email: "jest_test_user_1@testing.com" });
      const userTo: User = await userModel.findOne({ email: "jest_test_user_2@testing.com" });


      const { cookie } = await authService.login({ email: userFrom.email, password: "123" });
      const [certificateTOTransfer] = await carbonCertificatesService.findByUserId(userFrom._id.toString());

      const res = await request(server)
        .post(`${carbonCertificatesRoute.path}/${certificateTOTransfer._id}/transfer`)
        .send({ toUserId: userTo._id })
        .set("Cookie", cookie);

      expect(res.status).toBe(200);

      const { data: updatedCertificate } = res.body;

      expect(updatedCertificate.status).toBe(CarbonCertificateStatus.transferred);
      expect(updatedCertificate.owner.toString()).toBe(userTo._id.toString());
      expect(res.status).toBe(200);
    });
  });
});
