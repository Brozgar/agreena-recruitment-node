import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "@config";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, TokenData } from "@interfaces/auth.interface";
import { User, UserResponse } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";

class AuthService {
  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await userModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    return await userModel.create({ ...userData, password: hashedPassword });
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: UserResponse }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const user: User = await userModel.findOne({ email: userData.email });
    if (!user) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    const responseUser: UserResponse = { _id: user._id, email: user.email };

    return { cookie, user: responseUser };
  }

  public async logout(userData: User): Promise<UserResponse> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const user: User = await userModel.findOne({ email: userData.email, password: userData.password });
    if (!user) throw new HttpException(409, `This email ${userData.email} was not found`);

    return { _id: user._id, email: user.email };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
