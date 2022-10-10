import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "users", timestamps: true } })
class User {
  @prop({ type: String, required: true, unique: true })
  public email: string;

  @prop({ type: String, required: true })
  public password: string;

  @prop({ default: Date.now() })
  public createdAt?: Date;

  @prop({ default: Date.now() })
  public updatedAt?: Date;
}

const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });

export default UserModel;
