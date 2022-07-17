import * as mongoose from 'mongoose';

export enum SELL_ORDER_TYPE {
  INSTANCE_SALE = 1,
  TIME_AUCTION = 2,
}

export enum SELL_ORDER_STATUS {
  ACTIVE = 1,
  CANCELLED = 2,
  CLOSED = 3,
  CANCEL_PROCESSING = 4
}

export const SellOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
  saleQuantity: { type: Number },
  soldQuantity: { type: Number },
  price: { type: String },
  serviceFee: { type: Number },
  receive: { type: String },
  status: { type: Number },
  cancelDetail: { type: Object },
  txId: { type: String },
  chainId: { type: Number },
  currencyKey: { type: String },
  currencyName: { type: String },
  type: { type: Number, default: SELL_ORDER_TYPE.INSTANCE_SALE }, // 1 is instance sale , 2 is time auction
  minimumBid: { type: String }, // first bid price for time auction
  highestBid: { type: String }, // highest bid price when sb bid
  startDate: { type: Date, default: new Date() },
  endDate: { type: Date },
  expiredDate: { type: Date },
  eventStatus: { type: Number, default: 1 },
  incrementPercent: { type: Number },
},{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

export interface SellOrder extends mongoose.Document {
  _id: string;
  artworkId: string;
  saleQuantity: number;
  soldQuantity: number;
  price: string;
  serviceFee: number;
  receive: string;
  status: number;
  cancelDetail: Object;
  txId: string;
  chainId: number;
  currencyKey: string;
  currencyName: string;
  type: number;
  minimumBid: string;
  highestBid: string;
  startDate: Date;
  endDate: Date;
  expiredDate: Date;
  eventStatus: number;
  incrementPercent: number;
  createdAt: Date;
  updatedAt: Date;
}