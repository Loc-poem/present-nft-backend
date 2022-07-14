import { Injectable, Logger } from "@nestjs/common";
const { create, urlSource } = require('ipfs-http-client')
import { Artwork } from "../../database/models/artwork.model";
import { s3Service } from "../s3/s3.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ipfsService {
  constructor(
    @InjectModel('User') private readonly artworkModel: Model<Artwork>,
    private readonly s3Service: s3Service,
  ) {}

  private IPFS_CONFIG = {
    IPFS_URI: String(process.env.IPFS_URI),
    IPFS_GATEWAY_URL: String(process.env.IPFS_GATEWAY_URL),
  }

  private logger: Logger = new Logger('ipfsService');

  async uploadFromSource(artwork: Artwork) {
    try {
      this.logger.log(`===Start upload file to IPFS===`)
      const ipfs = this.getIPFS();
      const uploadIpfs = await ipfs.add(urlSource(artwork.contentUrl));
      this.logger.log(`===End upload file to IPFS success===`);
      const cid = uploadIpfs.cid;
      const uri = process.env.IPFS_GATEWAY_URL + cid;
      const objectMetadata = this.s3Service.convertJsonToS3(cid, artwork);
      await this.s3Service.uploadJsonToS3(JSON.stringify(objectMetadata), artwork.keys3);
      await this.artworkModel.updateOne(
        { _id: artwork._id },
        {
          $set: {
            uri: uri,
            ipfsCid: cid,
            metadata_url: process.env.IPFS_GATEWAY_URL + artwork.keys3,
          }
        })
    } catch (e) {
      console.log("Error when upload file to ipfs: " + e);
    }
  }

  getIPFS() {
    return create(this.IPFS_CONFIG.IPFS_URI);
  }
}