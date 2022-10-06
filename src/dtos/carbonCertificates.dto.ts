import { IsEnum, IsString } from "class-validator";
import { prop, Ref } from "@typegoose/typegoose";
import UserModel from "@models/users.model";
import { User } from "@interfaces/users.interface";
import { CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";

export class CreateUserDto {
  @IsString()
  public country: string;

  @IsEnum(CarbonCertificateStatus)
  public status: CarbonCertificateStatus;

  @prop({ ref: () => UserModel })
  public owner?: Ref<User>;
}
