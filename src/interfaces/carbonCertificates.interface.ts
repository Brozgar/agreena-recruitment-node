import { User } from "@interfaces/users.interface";

export interface CarbonCertificate {
  _id: string;
  country: string;
  status: CarbonCertificateStatus;
  owner?: User;
}

export enum CarbonCertificateStatus {
  available = "available",
  owned = "owned",
  transferred = "transferred",
}
