import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";
import { CarbonCertificate, CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";
import { User } from "@interfaces/users.interface";
import mongoose from "mongoose";
import { hash } from "bcrypt";


export class PopulateDbMigration implements MigrationInterface {
  async up(db: Db): Promise<any> {
    const countries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain"];

    const usersData = [];
    let userCounter = 0;
    while (userCounter < 10) {
      const user: User = {
        email: `test_user_${userCounter + 1}@testing.com`,
        password: await hash("123", 10)
      };

      usersData.push(user);

      userCounter++;
    }
    const users = await db.collection("users").insertMany(usersData);

    let userIdsWithCertificates = Object.values(users.insertedIds).slice(0, 5);

    const certificatesData = [];
    let certificatesCounter = 0;
    while (certificatesCounter < 100) {
      const certificate: CarbonCertificate = {
        country: countries[Math.floor(Math.random() * countries.length)],
        status: CarbonCertificateStatus.available
      };

      if (certificatesCounter < userIdsWithCertificates.length) {
        certificate.owner = new mongoose.Types.ObjectId(userIdsWithCertificates[certificatesCounter]);
        certificate.status = CarbonCertificateStatus.owned;
      }

      certificatesData.push(certificate);

      certificatesCounter++;
    }

    await db.collection("carbonCertificates").insertMany(certificatesData);
  }

  async down(db: Db): Promise<any> {
    await db.collection("users").deleteMany({});
    await db.collection("carbonCertificates").deleteMany({});
  }
}
