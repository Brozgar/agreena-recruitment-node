import { mongoMigrateCli } from "mongo-migrate-ts";
import { dbConnection } from "@databases";

mongoMigrateCli({
  uri: dbConnection,
  migrationsDir: __dirname,
  migrationsCollection: "migrations_collection"
});
