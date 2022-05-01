import * as mongoose from "mongoose";

export const ArtworkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellOrder' },
  imageUrl: { type: String },
  name: { type: String },
  numberOfCopies: { type: Number },
  availableOfCopies: { type: Number },
  royaltyFee: { type: Number },
  status: { type: Number },
  ipfsCid: { type: String },
  description: { type: String },
  descriptionForSearch: { type: String },
  chainId: { type: Number, default: process.env.BSC_CHAIN },
  show: { type: Boolean, default: true },
  collectionType: { type: Number },
  contentUrl: { type: String },
  urlCode: { type: String },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  tokenId: { type: String },
  contractAddress: { type: String },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export interface Artwork extends mongoose.Document {
  _id: string;
  userId: string;
  sellOrderId: string;
  imageUrl: string;
  name: string;
  numberOfCopies: number;
  availableOfCopies: number;
  royaltyFee: number;
  status: number;
  ipfsCid: string;
  description: string;
  descriptionForSearch: string;
  chainId: number;
  show: boolean;
  collectionType: number;
  contentUrl: string;
  urlCode: string;
  collectionId: string;
  tokenId: string;
  contractAddress: string;
  createdAt: Date;
  updatedAt: Date;
}