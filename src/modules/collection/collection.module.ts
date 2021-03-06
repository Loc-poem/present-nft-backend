import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../../database/models/user.model";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { collectionController } from "./collection.controller";
import { collectionService } from "./collection.service";
import { CollectionSchema } from "../../database/models/collection.model";
import { s3Module } from "../s3/s3.module";

@Module({
  controllers: [collectionController],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Collection', schema: CollectionSchema },
    ]),
    s3Module,
  ],
  providers: [collectionService],
  exports: [],
})

export class collectionModule {}