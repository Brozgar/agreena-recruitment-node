import { User } from "@interfaces/users.interface";
import mongoose from "mongoose";

export interface CarbonCertificate {
  _id?: string;
  country: string;
  status: CarbonCertificateStatus;
  owner?: string | mongoose.Types.ObjectId | User;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum CarbonCertificateStatus {
  available = "available",
  owned = "owned",
  transferred = "transferred",
}
