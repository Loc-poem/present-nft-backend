import { Module } from "@nestjs/common";
import { s3Service } from "./s3.service";

@Module({
  controllers: [],
  imports: [],
  providers: [s3Service],
  exports: [s3Service],
})

export class s3Module {}