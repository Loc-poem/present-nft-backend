import * as mongoose from 'mongoose';
import { Schema } from "mongoose";

export const USER_ROLE = {
  ARTIST: 1,
}

export const USER_LOGIN_STATUS = {
  NOT_REGISTER: 1,
  REGISTER: 2,
}

export const UserSchema = new mongoose.Schema(
  {
      username: { type: String, default: null },
      email: { type: String, default: null },
      password: { type: String },
      lastToken: { type: String },
      nationality: { type: String },
      city: { type: String },
      zipCode: { type: String },
      phoneNumber: { type: String },
      avatarUrl: { type: String, default: null },
      chainId: { type: Number, default: process.env.BSC_CHAIN },
      networkAddress: { type: String, default: null },
      currentStep: { type: Number },
      otpCode: { type: String },
      expiredDate: { type: Date },
      term: { type: Boolean, default: true },
      role: { type: Number, default: USER_ROLE.ARTIST },
  },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
)

export interface User extends mongoose.Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    lastToken: string;
    nationality: string;
    city: string;
    zipCode: string;
    phoneNumber: string;
    avatarUrl: string;
    chainId: number;
    networkAddress: string;
    currentStep: number;
    otpCode: string,
    expiredDate: Date;
    term: boolean;
    role: number;
    createdAt: Date;
    updatedAt: Date;
}