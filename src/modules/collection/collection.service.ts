import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../database/models/user.model";
import { Collection, COLLECTION_STATUS } from "../../database/models/collection.model";
import {
  CreateCollectionDto,
  dataCreateCollectionDto,
  filterCollectionUserDto,
  UnverifyCollectionDto
} from "./dto/collection.dto";
import { AppConfig } from "../../common/contants/app-config";
import { ApiError } from "../../common/response/api-error";
import { s3Service } from "../s3/s3.service";
import * as randomize from 'randomatic';
import { uploadImageS3Dto } from "../s3/dto/upload-image-s3.dto";
import { Utils } from "../../common/utils/utils";
import { ApiOK } from "../../common/response/api-ok";

@Injectable()
export class collectionService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Collection') private readonly collectionModel: Model<Collection>,
    private readonly s3Service: s3Service,
  ) {}

  async createNewCollection(user, data: CreateCollectionDto, file) {
    const userData = await this.userModel.findOne({ _id: user._id }).lean();
    if (!userData) throw new ApiError("Invalid data","E-1");
    if (AppConfig.FILE_IMAGE_UPLOAD.indexOf(file.mimetype) === -1)
      throw new ApiError.error('Invalid file type.', 'E0', { field: 'fileLogo' });

    if (file.size > AppConfig.MAX_FILE_IMAGE_UPLOAD)
      throw new ApiError('Invalid file size.', 'E18', { field: 'fileLogo' });
    const { type, fileLogo, name, description, symbol, contractAddress, txId } = data;
    // get url code
    let { urlCode } = data;
    urlCode = await this.getUrlCode(data);

    // upload image to s3
    const newDataUpload = new uploadImageS3Dto();
    const folder = AppConfig.FOLDER_IMAGE_UPLOAD.COLLECTION_LOGO;
    newDataUpload.name = user._id;
    newDataUpload.file = file;
    newDataUpload.folder = folder;
    const uploadFileLogo = await this.s3Service.upload(newDataUpload);

    //create data of new collection
    const dataCreate = new dataCreateCollectionDto();
    dataCreate.logoUrl = uploadFileLogo['Location'];
    dataCreate.type = type;
    dataCreate.userId = user._id;
    dataCreate.name = name.trim();
    dataCreate.description = (description || "").trim();
    dataCreate.urlCode = urlCode;
    dataCreate.contractAddress = contractAddress;
    dataCreate.txId = txId;
    dataCreate.creator = userData.networkAddress;
    dataCreate.status = COLLECTION_STATUS.PROCESSING;
    dataCreate.symbol = symbol;
    dataCreate.username = user.username || "";
    dataCreate.userAvtUrl = user.avatarUrl || "";

    const response = await this.collectionModel.create(dataCreate);
    return new ApiOK(response);
  }

  async checkUrlCode(url) {
    const countCollection = await this.collectionModel.find({ urlCode: url, status: { $ne: COLLECTION_STATUS.FAILED } }).countDocuments();
    if (countCollection === 0) return url;
    let code = url + '-' + randomize('0', Math.floor(Math.random() * 11) + 1);
    return this.checkUrlCode(code);
  }

  async getUrlCode(data: CreateCollectionDto) {
    let result;
    if (data.urlCode) {
      result = await this.checkUrlCode(data.urlCode.toLowerCase());
    } else {
      result = Utils.getUrlCode();
    };
    return result;
  }

  async updateUnVerifyCollection(user, data: UnverifyCollectionDto) {
    const { collectionId, collectionSalt } = data;
    let collection = await this.collectionModel.updateOne(
      { _id: collectionId, userId: user._id, status: COLLECTION_STATUS.UNVERIFY },
      { $set: { status: COLLECTION_STATUS.VERIFY, collectionSalt: collectionSalt } },
    ) as any;

    if (collection.ok === 1) return new ApiOK({ result: true });

    return new ApiOK({ result: false });
  }


  async getListCollectionOfUser(user, data: filterCollectionUserDto) {
    const where = {} as any;
    if (data.collectionId) where['_id'] = data.collectionId;
    where.userId = user._id;
    if (data.status) where.status = data.status;
    let sortField = 'createdAt';
    let sortType = -1;
    if (data.sortField && data.sortType) {
      sortField = data.sortField;
      sortType = data.sortType;
    };
    if (data.fromDate) {
      const fromDate = new Date(data.fromDate)
      where['createdAt'] = {
        '$gte': fromDate,
      }
    }
    if (data.toDate) {
      const toDate = new Date(data.toDate)
      where['createdAt'] = {
        '$lte': toDate,
      }
    };
    let count = await this.collectionModel.find(where).countDocuments();
    const collectionData = await this.collectionModel.find(where).skip(Number(data.offset) || AppConfig.OFFSET).limit(Number(data.limit) || AppConfig.LIMIT).sort([[sortField, sortType]])
      .collation({ locale: "en" });
    return new ApiOK({
      total: count,
      result: collectionData,
    })
  };

  async getListCollectionDiscover(data) {
    const where = {} as any;

  }
}