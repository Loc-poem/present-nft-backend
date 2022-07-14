import { Module } from '@nestjs/common';
import { ipfsService } from './ipfs.service';
import { s3Module } from "../s3/s3.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ArtworkSchema } from "../../database/models/artwork.model";

@Module({
  providers: [],
  imports: [
    MongooseModule.forFeature([
      { name: 'Artwork', schema: ArtworkSchema },
    ]),
    s3Module,
  ],
  exports: [],
})
export class ipfsModule { }
