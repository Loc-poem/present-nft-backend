import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../database/models/user.model";
import { ApiError } from "../../common/response/api-error";
import { ApiOK } from "../../common/response/api-ok";

@Injectable()
export class userService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  async getUserById(id: string) {
    const userData = await this.userModel.findOne({ _id: id }).lean();
    if (!userData) throw new ApiError("Invalid user", "E-1");
    return userData;
  }

  async getUserInformation(user: any) {
    const userData = await this.getUserById(user._id);
    if (!userData) throw new ApiError("Invalid user", "E-1");
    const returnData = {
      username: userData.username || "",
      email: userData.email || "",
      networkAddress: userData.networkAddress,
      nationality: userData.nationality || "",
      city: userData.city || "",
      zipCode: userData.zipCode || "",
      phoneNumber: userData.phoneNumber || "",
      avatarUrl: userData.avatarUrl || "",
      role: userData.role,
    }
    return new ApiOK(returnData);
  }
}