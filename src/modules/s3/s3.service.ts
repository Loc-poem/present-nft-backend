import { Injectable } from "@nestjs/common";
import { S3 } from 'aws-sdk';
import { uploadImageS3Dto } from "./dto/upload-image-s3.dto";
import { Artwork, FILE_TYPE } from "../../database/models/artwork.model";
import { Utils } from "../../common/utils/utils";

@Injectable()
export class s3Service {
  constructor() {

  }

  async upload(data: uploadImageS3Dto) {
    const { file, name, folder } = data;
    const cut = file.originalname.split('.');
    const fileExt = cut[cut.length - 1];
    const time = new Date().getTime();
    let fileName = `${folder}/${name}-${time}.${fileExt}`;
    const s3 = this.getS3();
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          console.log(`===Upload file: ${name} to s3 failed.===`)
          reject(err.message);
        } else {
          console.log(`===Upload file: ${name} to s3 success.===`)
          resolve(data);
        }
      });
    });
  }

  async uploadJsonToS3(data, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: 'ipfs/' + String(name),
      Body: data,
      ContentEncoding: 'base64',
      ContentType: 'application/json',
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          console.log(`===Upload file: ${name} to s3 failed.===`)
          reject(err.message);
        } else {
          console.log(`===Upload file: ${name} to s3 success.===`)
          resolve(data);
        }
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
    });
  }

  convertJsonToS3(cid, artwork: Artwork) {
    let linkImage = process.env.IPFS_GATEWAY_URL + cid;
    let animation_url = '';
    if (artwork.fileType === FILE_TYPE.THREE_D) {
      linkImage = artwork.imageUrl;
      animation_url = artwork.contentUrl
    }
    if(artwork.fileType !== FILE_TYPE.IMAGE && artwork.fileType !== FILE_TYPE.THREE_D) {
      linkImage = artwork.imageUrl;
      animation_url = process.env.IPFS_GATEWAY_URL + cid;
    }
    let objectMeta = {
      name: Utils.stripHtml(artwork.name.trim()),
      description: artwork.descriptionForSearch,
      image: linkImage,
      external_url: artwork.external_url,
      //attributes: artwork.attributes,
      artist: artwork.ownerAddress,
    }
    if(animation_url){
      objectMeta['animation_url'] = animation_url;
    };
    return objectMeta;
  }
}