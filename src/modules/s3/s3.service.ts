import { Injectable } from "@nestjs/common";
import { S3 } from 'aws-sdk';
import { uploadImageS3Dto } from "./dto/upload-image-s3.dto";

@Injectable()
export class s3Service {
  constructor() {

  }

  async upload(data: uploadImageS3Dto) {
    const { buffer, mimetype, name } = data;
    const s3 = this.getS3();
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: name,
      Body: buffer,
      ContentType: mimetype,
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
}