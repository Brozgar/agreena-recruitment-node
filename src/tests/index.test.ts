import request from "supertest";
import App from "@/app";
import IndexRoute from "@routes/index.route";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Testing index", () => {
  describe("[GET] /", () => {
    it("response statusCode 200", () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);

      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
