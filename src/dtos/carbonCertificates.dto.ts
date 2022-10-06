import { IsString } from "class-validator";

export class TransferCarbonCertificateDto {
  @IsString()
  public toUserId: string;
}
