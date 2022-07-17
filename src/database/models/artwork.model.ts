import * as mongoose from "mongoose";

export const ArtworkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerAddress: { type: String },
  sellOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellOrder' },
  imageUrl: { type: String },
  name: { type: String },
  numberOfCopies: { type: Number },
  availableOfCopies: { type: Number },
  royaltyFee: { type: Number },
  status: { type: Number },
  fileType: { type: String },
  ipfsCid: { type: String },
  uri: { type: String },
  metadata_url: { type: String },
  description: { type: String },
  external_url: { type: String, default: ''},
  descriptionForSearch: { type: String },
  chainId: { type: Number, default: process.env.BSC_CHAIN },
  show: { type: Boolean, default: true },
  collectionType: { type: Number },
  contentUrl: { type: String },
  urlCode: { type: String },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  collectionName: { type: String },
  tokenId: { type: String },
  keys3: { type: String },
  contractAddress: { type: String },
  sellOrderActive: { type: Object, default: {} },
  price: { type: String },
  categoriesId: { type: Array },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
})

export interface Artwork extends mongoose.Document {
  _id: string;
  userId: string;
  ownerAddress: string;
  sellOrderId: string;
  categoriesId: [];
  imageUrl: string;
  name: string;
  numberOfCopies: number;
  availableOfCopies: number;
  royaltyFee: number;
  status: number;
  ipfsCid: string;
  fileType: string;
  uri: string;
  metadata_url: string;
  description: string;
  descriptionForSearch: string;
  chainId: number;
  show: boolean;
  collectionType: number;
  collectionName: string;
  contentUrl: string;
  urlCode: string;
  collectionId: string;
  tokenId: string;
  keys3: string;
  contractAddress: string;
  createdAt: Date;
  updatedAt: Date;
  sellOrderActive: object;
  price: string;
  external_url: string;
}

export enum FILE_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  THREE_D = '3d',
}

export enum ARTWORK_STATUS {
  OFF_SALE = 1,
  ON_SALE = 2,
  SOLD_OUT = 3,
}

export const FILE_ARTWORK_UPLOAD_IMAGE = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'];
export const FILE_ARTWORK_UPLOAD_AUDIO = ['audio/x-aiff', 'audio/basic', 'audio/x-mpegurl', 'audio/mid', 'audio/mpeg', 'audio/x-pn-realaudio', 'audio/wav', 'audio/webm', 'audio/ogg'];
export const FILE_ARTWORK_UPLOAD_VIDEO = ['video/x-ms-asf', 'video/x-msvideo', 'video/x-la-asf', 'video/quicktime', 'video/x-sgi-movie', 'video/mpeg', 'video/mp4', 'video/webm', 'video/ogg'];
export const FILE_ARTWORK_UPLOAD_THREE_D = ['x-world/x-vrml', 'application/x-troff-ms', 'model/gltf-binary'];