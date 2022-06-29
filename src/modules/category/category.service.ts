import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "../../database/models/category.model";
import { s3Service } from "../s3/s3.service";
import { uploadImageS3Dto } from "../s3/dto/upload-image-s3.dto";
import { AppConfig } from "../../common/contants/app-config";
import { ApiOK } from "../../common/response/api-ok";
import { createCategoryDto, deleteCategoryDto, filterCategoryDto } from "./dto/category.dto";
import { ApiError } from "../../common/response/api-error";
import { get } from 'lodash';

@Injectable()
export class categoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly s3Service: s3Service,
  ) {}

  async create(user, data: createCategoryDto, file) {
    try {
      const { name, description } = data;
      const dataUploadS3 = new uploadImageS3Dto();
      dataUploadS3.name = user._id;
      dataUploadS3.file = file;
      dataUploadS3.folder = AppConfig.FOLDER_IMAGE_UPLOAD.CATEGORY_ICON;
      const uploadFile = await this.s3Service.upload(dataUploadS3);
      const dataInsert = {
        name: name,
        description: description || "",
        iconUrl: uploadFile['Location'],
      }
      const category = await this.categoryModel.create(dataInsert);
      return new ApiOK({ _id: category._id });
    } catch (ex) {
      throw new ApiError(AppConfig.DEFAULT_MESSAGE_ERROR, "E-1");
    }
  }

  async delete(user, data: deleteCategoryDto) {
    try {
      await this.categoryModel.deleteOne({ _id: data.categoryId });
      return new ApiOK({ result: true });
    } catch (ex) {
      throw new ApiError(AppConfig.DEFAULT_MESSAGE_ERROR, "E-1");
    }
  }

  async get(id: string) {
    try {
      const category = await this.categoryModel.findOne({ _id: id }).lean();
      return category;
    } catch (ex) {
      throw new ApiError(AppConfig.DEFAULT_MESSAGE_ERROR, "E-1");
    }
  }

  async getList(filter: filterCategoryDto) {
    const { categoryId, status, limit, offset} = filter;
    let agg = [];
    let where = {};
    let sort = {
      $sort: {
      }
    }
    const collation = { locale: "en" };
    let sortField = AppConfig.DEFAULT_SORT_FIELD;
    let sortType = AppConfig.SORT_DESC;
    if (filter.sortField && filter.sortType) {
      sortType = filter.sortType;
      sortField = filter.sortField;
    }
    sort.$sort[sortField] = sortType;
    if (categoryId) where['_id'] = categoryId;
    if (status) where['status'] = status;
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
}