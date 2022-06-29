import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Artwork, ARTWORK_STATUS, FILE_TYPE } from "../../database/models/artwork.model";
import { createArtworkDto } from "./dto/artwork.dto";
import { s3Service } from "../s3/s3.service";
import { uploadImageS3Dto } from "../s3/dto/upload-image-s3.dto";
import { AppConfig } from "../../common/contants/app-config";
import { CATEGORIES_STATUS, Category } from "../../database/models/category.model";
import { ApiError } from "../../common/response/api-error";
import { isEmpty, omit, get } from 'lodash'
import { Collection, COLLECTION_TYPE } from "../../database/models/collection.model";
import { Utils } from "../../common/utils/utils";
import { ApiOK } from "../../common/response/api-ok";
import { filterGetListDto } from "./dto/filter-artwork.dto";

@Injectable()
export class artworkService {
  constructor(
    @InjectModel('Artwork') private readonly artworkModel: Model<Artwork>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Collection') private readonly collectionModel: Model<Collection>,
    private readonly s3Service: s3Service,
  ) {}

  async createArtwork(user, data: createArtworkDto, file: Express.Multer.File, filePreview: Express.Multer.File) {
    try {
      let dataUploadArtwork = new uploadImageS3Dto();
      dataUploadArtwork.file = file;
      dataUploadArtwork.name = user._id;
      dataUploadArtwork.folder = AppConfig.FOLDER_IMAGE_UPLOAD.ARTWORK;
      const uploadFile = await this.s3Service.upload(dataUploadArtwork);
      dataUploadArtwork.folder = AppConfig.FOLDER_IMAGE_UPLOAD.ARTWORK_PREVIEW;
      let uploadFilePreview;
      if (filePreview) {
        dataUploadArtwork.file = filePreview;
      }
      // create image preview.
      uploadFilePreview = await this.s3Service.upload(dataUploadArtwork);
      let dataValidate = omit(data, ['file','filePreview']);
      dataValidate.contentUrl = uploadFile['Location'];
      dataValidate.imageUrl = uploadFilePreview['Location'];
      const cut = data.categoriesId.split(',');
      const ids = cut.map((e) => { return e.trim() });
      const categories = await this.categoryModel
        .find({ storeId: data.storeId, status: CATEGORIES_STATUS.ON })
        .where('_id').in(ids).exec();
      if (categories.length === 0) throw new ApiError('categories not found.', 'E32');
      const collectionData = await this.collectionModel.findOne({ _id: data.collectionId }, { userId: 1, storeId: 1, type: 1, contractAddress: 1 }).lean();
      if (collectionData.type === COLLECTION_TYPE.ERC_721) data.numberOfCopies = AppConfig.NFT_ERC_721_QUANTITY;
      if (data.fileType !== FILE_TYPE.IMAGE && !dataValidate.imageUrl) throw new ApiError("Image url is required", "E-1");
      const urlCode = await this.getUrlCode(data, user._id);
      const external_url = `https://${process.env.domain}/artwork/${urlCode}`;
      const dataCreateArtwork = this.validateDataCreate(dataValidate, user, collectionData, ids, urlCode, external_url);
      const newArtwork = await this.artworkModel.create(dataCreateArtwork);
      return new ApiOK({
        artworkId: newArtwork._id,
      })
    } catch (e) {
      throw new ApiError(e, "E-1");
    }
  }

  validateDataCreate(dataValidate, user, collectionData, ids, urlCode, external_url) {
    const nftifyTokenIdData = Utils.generateTokenId();
    const newArtwork = {
      userId: user._id,
      imageUrl: dataValidate.imageUrl,
      status: ARTWORK_STATUS.OFF_SALE,
      name: dataValidate.name,
      numberOfCopies: dataValidate.numberOfCopies,
      availableOfCopies: dataValidate.numberOfCopies,
      royaltyFee: dataValidate.royaltyFee,
      fileType: dataValidate.fileType,
      description: dataValidate.description || "",
      descriptionForSearch: Utils.stripHtml(dataValidate.description || ""),
      chainId: process.env.BSC_CHAIN,
      show: dataValidate.show === 0 ? false : true,
      collectionType: collectionData.type,
      contentUrl: dataValidate.contentUrl,
      urlCode: urlCode,
      collectionId: dataValidate.collectionId,
      tokenId: nftifyTokenIdData.tokenId || "",
      keys3: nftifyTokenIdData.keys3 || "",
      contractAddress: collectionData.contractAddress,
      categoriesId: Utils.getUniqueArray(ids),
      external_url: external_url,
    };
    return newArtwork;
  }

  async getUrlCode(data, userId) {
    let result;
    if (data.urlCode) {
      result = await this.checkUrlCode(data.urlCode.toLowerCase(), userId);
    } else {
      result = Utils.getUrlCode();
    };
    return result;
  }

  async checkUrlCode(urlCode: string, userId) {
    const countNft = await this.artworkModel.find({ userId: userId, urlCode }).countDocuments();

    if (countNft === 0) return urlCode;

    let code = Utils.randomUrlCode(urlCode);

    return this.checkUrlCode(code, userId);
  }

  async getListArtwork(user, filter: filterGetListDto) {
    const { name, collectionId, contractAddress, status, limit, offset } = filter;
    let agg = [];
    let where = {};
    let sort = {
      $sort: {
      }
    }
    const collation = { locale: "en" };
    where['userId'] = user._id;
    if (name) where['name'] = {'$regex': Utils.escapeRegex(name), '$options': 'i'};
    if (collectionId) where['collectionId'] = collectionId;
    if (contractAddress) where['contractAddress'] = contractAddress;
    if (status) where['status'] = status;
    let sortField = AppConfig.DEFAULT_SORT_FIELD;
    let sortType = AppConfig.SORT_DESC;
    if (filter.sortField && filter.sortType) {
      sortType = filter.sortType;
      sortField = filter.sortField;
    }
    sort.$sort[sortField] = sortType;

    agg.push({ $match: where });
    agg.push(sort);
    agg.push({
      $facet: {
        count:  [{ $count: "count" }],
        data: [
          { $skip: offset || AppConfig.OFFSET },
          { $limit: limit || AppConfig.LIMIT }
        ]
      }
    });
    let dataQuery = await this.categoryModel.aggregate(agg).collation(collation);
    const dataCategory = get(dataQuery, [0, 'data']) || [];
    const total = get(dataQuery, [0, 'count', 0, 'count']) || 0;
    return new ApiOK({
      total: total,
      records: dataCategory,
    })
  }

  async getDetail(user, id) {
    try {
      const artwork = await this.artworkModel.findOne({ _id: id, userId: user._id }).lean();
      if (!artwork) throw new ApiError("Invalid info", "E-1");
      const collectionData = await this.collectionModel.findOne({ _id: artwork.collectionId }, { logoUrl: 1, name: 1, type: 1 }).lean();
      return new ApiOK({
        ...artwork,
        ...collectionData,
      })
    } catch (e) {
      throw new ApiError("Error: " + e);
    }
  }
}