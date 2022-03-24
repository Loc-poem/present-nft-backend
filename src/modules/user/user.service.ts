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

  async getUserInformation(user: any) {
    const userData = await this.userModel.findOne({ _id: user._id }).lean();
    if (!user) throw new ApiError("Invalid user", "E-1");
    const returnData = {
      username: userData.username,
      email: userData.email,
      nationality: userData?.nationality || "",
      city: userData?.city || "",
      zipCode: userData?.zipCode || "",
      phoneNumber: userData?.phoneNumber || "",
      currentStep: userData.currentStep,
    }
    return new ApiOK(returnData)
  }
}