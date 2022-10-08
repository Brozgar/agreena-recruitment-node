import { prop, getModelForClass, modelOptions, index, Ref } from "@typegoose/typegoose";
import UserModel from "@models/users.model";
import { User } from "@interfaces/users.interface";
import { CarbonCertificateStatus } from "@interfaces/carbonCertificates.interface";

@index({ status: 1 })
@index({ country: 1, status: 1 })
@index({ owner: 1, status: 1 })
@modelOptions({ schemaOptions: { collection: "carbonCertificates", timestamps: true } })
class CarbonCertificate {
  @prop({ type: String, required: true })
  public country: string;

  @prop({ type: String, required: true })
  public status: CarbonCertificateStatus;

  @prop({ ref: () => UserModel })
  public owner?: Ref<User>;

  @prop({ default: new Date(Date.now()) })
  public createdAt?: Date;

  @prop({ default: new Date(Date.now()) })
  public updatedAt?: Date;
}

const CarbonCertificateModel = getModelForClass(CarbonCertificate, { schemaOptions: { timestamps: true } });

export default CarbonCertificateModel;
