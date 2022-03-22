import * as mongoose from 'mongoose';
import { Schema } from "mongoose";

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
    createdAt: Date;
    updatedAt: Date;
}