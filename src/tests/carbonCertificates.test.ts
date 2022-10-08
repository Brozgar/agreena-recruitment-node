import mongoose from "mongoose";
import request from "supertest";
import App from "@/app";
import userModel from "@models/users.model";
import { User } from "@interfaces/users.interface";
import { CarbonCertificate, CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";
import carbonCertificatesModel from "@models/carbonCertificates.model";
import CarbonCertificatesRoute from "@routes/carbonCertificates.route";

describe("Testing carbon certificates", () => {
  const basePath = "/carbon-certificates";
  let carbonCertificatesRoute;
  let app;
  let server;

  beforeAll(async () => {
    carbonCertificatesRoute = new CarbonCertificatesRoute();
    app = new App([carbonCertificatesRoute]);
    server = app.getServer();

    // Clear up DB in case of broken tests
    await carbonCertificatesModel.deleteMany({});
    await userModel.deleteMany({});

    const countries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain"];
    const usersData = [];
    let userCounter = 0;

    while (userCounter < 10) {
      const user: User = {
        email: `jest_test_user_${userCounter + 1}@testing.com`,
        password: "123"
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

  describe(`[GET] ${basePath}`, () => {
    it("response should include only available certificates", async () => {
      const carbonCertificatesRoute = new CarbonCertificatesRoute();

      const res = await request(server).get(carbonCertificatesRoute.path);

      expect(res.status).toBe(200);

      const { data: certificates } = res.body;
      const hasOnlyAvailable = certificates.every(certificate => certificate.status === CarbonCertificateStatus.available);

      expect(certificates.length).toBeGreaterThan(0)
      expect(hasOnlyAvailable).toBe(true)
      expect(res.status).toBe(200)
    });
  });
});
