import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../database/models/user.model";
import { Utils } from "../../common/utils/utils";
import { ApiError } from "../../common/response/api-error";
import { JwtService } from "@nestjs/jwt";
import { ApiOK } from "../../common/response/api-ok";
import { AppConfig } from "../../common/contants/app-config";
import { Mailer } from "../email/mailer";
import { LoginUserDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { ResendVerifyOtpDto, VerifyOtpcodeDto } from "./dto/verify.dto";
import { AddWalletUserDto, UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class authService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {
  }

  async registerUser(data: RegisterUserDto) {
    const isUsedEmail = await this.userModel.findOne({ email: {'$regex': Utils.escapeRegex(data.email), '$options': 'i'} });
    if (isUsedEmail) throw new ApiError('Email is already registered', 'E2');
    data.email = data.email.toLowerCase();
    const otpCode = Utils.generateOTP();
    const moment = new Date();
    const expiredDate = new Date();
    expiredDate.setDate(moment.getDate() + 1);
    const newUser = await this.userModel.create({
      email: data.email,
      password: await Utils.hashPassword(data.password),
      username: data.username,
      currentStep: AppConfig.LOGIN_STEP.VERIFY_OTP_CODE,
      otpCode: otpCode,
      expiredDate: expiredDate,
    });
    const accessToken = Utils.generateToken(newUser, this.jwtService);
    newUser.lastToken = accessToken;
    await newUser.save();
    try {
      const context = {
        otpCode: otpCode,
      }
      Mailer.sendEmail(data.email, AppConfig.EMAIL_SUBJECT.VERIFY_ACCOUNT, 'user', 'verify-account', context);
    } catch (err) {
      console.log("error when send email verify otp " + err);
    }
    return new ApiOK({
      lastToken: accessToken,
      step: AppConfig.LOGIN_STEP.VERIFY_OTP_CODE,
    });
  }

  async loginUser(data: LoginUserDto) {
    const user = await this.userModel.findOne({ email: {'$regex': Utils.escapeRegex(data.email), '$options': 'i'} }, { currentStep: 1,password: 1 }).lean();
    if (!user || !await bcrypt.compare(data.password, user.password)) {
      throw new ApiError('Password or email is invalid', 'E15');
    };
    const accessToken = Utils.generateToken(user, this.jwtService);
    await this.userModel.updateOne({ _id: user._id }, { lastToken: accessToken });
    return new ApiOK({ lastToken: accessToken, currentStep: user.currentStep });
  }

  async logout(request: any) {
    const user = Utils.decodeJwtService(request.headers['authorization'],this.jwtService) ;
    try {
      await this.userModel.updateOne({ _id: user['_id'] }, { lastToken: null });
      return new ApiOK({ result: true });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOtpCode(data: VerifyOtpcodeDto) {
    const user = await this.userModel.findOne({
      email: { '$regex': Utils.escapeRegex(data.email),'$options': 'i' },
      otpCode: data.otpCode,
    },{
      expiredDate: 1,
    }).lean();
    if (!user) throw new ApiError("Otp code is invalid", "E4");
    const moment = new Date();
    if (moment > user.expiredDate) throw new ApiError("Otp code has expired. Please re-send email to get new otp code", "E6");
    await this.userModel.updateOne({ _id: user._id }, {$set: { otpCode: "", currentStep: AppConfig.LOGIN_STEP.ADD_INFO }});
    return new ApiOK({ result: true, step: AppConfig.LOGIN_STEP.ADD_INFO });
  }

  async verifyCodeForgotPassword(data: VerifyOtpcodeDto) {
    const user = await this.userModel.findOne({
      email: { '$regex': Utils.escapeRegex(data.email),'$options': 'i' },
      otpCode: data.otpCode,
    },{
      expiredDate: 1,
    }).lean();
    if (!user) throw new ApiError("Otp code is invalid", "E4");
    const moment = new Date();
    if (moment > user.expiredDate) throw new ApiError("Otp code has expired. Please re-send email to get new otp code", "E6");
    await this.userModel.updateOne({ _id: user._id }, {$set: { otpCode: "" }});
    return new ApiOK({ result: true });
  }

  async resendVerifyAccount(data: ResendVerifyOtpDto) {
    const user = await this.userModel.findOne({ email: { '$regex': Utils.escapeRegex(data.email),'$options': 'i'} }, { _id: 1, currentStep: 1, email: 1 }).lean();
    if (!user || (user && user.currentStep != AppConfig.LOGIN_STEP.VERIFY_OTP_CODE)) throw new ApiError("Invalid email", "E-1");
    const otpCode = Utils.generateOTP();
    const moment = new Date();
    const expiredDate = new Date();
    expiredDate.setDate(moment.getDate() + 1);
    await this.userModel.updateOne({ _id: user._id }, {$set: { otpCode: otpCode, expiredDate: expiredDate }});
    try {
      const context = {
        otpCode: otpCode,
      }
      Mailer.sendEmail(user.email, AppConfig.EMAIL_SUBJECT.VERIFY_ACCOUNT, 'user', 'verify-account', context);
    } catch (err) {
      console.log("error when send email verify otp " + err);
    }
    return new ApiOK({ result: true });
  }

  async sendVerifyCodePassword(data: ResendVerifyOtpDto) {
    const user = await this.userModel.findOne({ email: { '$regex': Utils.escapeRegex(data.email),'$options': 'i'} }, { _id: 1, username: 1, email: 1 }).lean();
    if (!user) throw new ApiError("Invalid email", "E-1");
    const otpCode = Utils.generateOTP();
    const moment = new Date();
    const expiredDate = new Date();
    expiredDate.setDate(moment.getDate() + 1);
    await this.userModel.updateOne({ _id: user._id }, {$set: { otpCode: otpCode, expiredDate: expiredDate }});
    try {
      const context = {
        username: user.username,
        otpCode: otpCode,
      };
      Mailer.sendEmail(user.email, AppConfig.EMAIL_SUBJECT.FORGOT_PASSWORD, 'user', 'forgot-password', context);
    } catch (err) {
      console.log("error when send email verify otp " + err);
    }
    return new ApiOK({ result: true });
  }

  async resetPassword(data: LoginUserDto) {
    const user = await this.userModel.findOne({ email: { '$regex': Utils.escapeRegex(data.email),'$options': 'i'} });
    if (!user) throw new ApiError("Invalid user", "E1");
    const password = await Utils.hashPassword(data.password);
    user['password'] = password;
    await user.save();
    return new ApiOK({ result: true });
  }

  async updateUserInfo(data: UpdateUserDto, user) {
    await this.userModel.updateOne(
      { _id: user._id },
      {
        nationality: data.nationality,
        city: data.city,
        zipCode: data.zipCode,
        phoneNumber: data.phoneNumber,
        currentStep: AppConfig.LOGIN_STEP.ADD_WALLET,
      }
    );
    return new ApiOK({ result: true, step: AppConfig.LOGIN_STEP.ADD_WALLET });
  }

  async addWalletUser(data: AddWalletUserDto, user: any) {
    const userData = await this.userModel.findOne(
      {
        _id: user._id,
        $or: [
          { networkAddress: { $exists: false } },
          { networkAddress: null }
        ]
      }).lean();
    if (!userData) throw new ApiError("Invalid user", "E-1");
    await this.userModel.updateOne({ _id: user._id }, { $set: { networkAddress: data.walletAddress, currentStep: AppConfig.LOGIN_STEP.ACTIVE } });
    return new ApiOK({ result: true, step: AppConfig.LOGIN_STEP.ACTIVE });
  }

}