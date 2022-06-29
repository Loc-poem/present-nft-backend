import * as mongoose from 'mongoose';
export enum COLLECTION_STATUS {
  PROCESSING = 1,
  UNVERIFY = 2,
  VERIFY = 3,
  FAILED = 4,
}

export enum COLLECTION_TYPE {
  ERC_721 = 1,
  ERC_1155 = 2,
}

export const CollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, default: "" },
  userAvtUrl: { type: String, default: "" },
  logoUrl: { type: String },
  name: { type: String },
  type: { type: Number, enum: [COLLECTION_TYPE.ERC_721, COLLECTION_TYPE.ERC_1155] },
  description: { type: String },
  urlCode: { type: String },
  contractAddress: { type: String },
  networkType: { type: Number, default: process.env.BSC_CHAIN },
  signCollection: { type: String },
  status: { type: Number, enum: [COLLECTION_STATUS.PROCESSING, COLLECTION_STATUS.UNVERIFY, COLLECTION_STATUS.VERIFY, COLLECTION_STATUS.FAILED], default: COLLECTION_STATUS.PROCESSING },
  txId: { type: String },
  collectionSalt: { type: String },
  creator: { type: String, default: "" },
  symbol: { type: String }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

export interface Collection extends mongoose.Document {
  _id: string,
  userId: string,
  username: string,
  userAvtUrl: string,
  logoUrl: string,
  name: string,
  type: number,
  description: string,
  urlCode: string,
  contractAddress: string,
  networkType: number,
  signCollection: string,
  status: number,
  txId: string,
  collectionSalt: string,
  creator: string,
  symbol: string,
  createdAt: Date,
  updatedAt: Date,
}
