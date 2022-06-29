import * as Mongoose from "mongoose";
export const CATEGORIES_STATUS = {
  OFF: 2,
  ON: 1
}

export const CategorySchema = new Mongoose.Schema({
  status: { type: Number, default: CATEGORIES_STATUS.ON }, // 0 => off, 1 => on
  name: { type: String },
  iconUrl: { type: String },
  description: { type: String },
},{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export interface Category extends Mongoose.Document {
  _id: string;
  status: number;
  name: string;
  iconUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
