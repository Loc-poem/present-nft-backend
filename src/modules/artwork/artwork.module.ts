import { Module } from "@nestjs/common";
import { artworkController } from "./artwork.controller";
import { artworkService } from "./artwork.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ArtworkSchema } from "../../database/models/artwork.model";
import { s3Module } from "../s3/s3.module";
import { CategorySchema } from "../../database/models/category.model";
import { CollectionSchema } from "../../database/models/collection.model";

@Module({
  imports: [
    s3Module,
    MongooseModule.forFeature([
      { name: 'Artwork', schema: ArtworkSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Collection', schema: CollectionSchema },
    ])
  ],
  controllers: [artworkController],
  providers: [artworkService],
  exports: [artworkService],
})

export class artworkModule {}