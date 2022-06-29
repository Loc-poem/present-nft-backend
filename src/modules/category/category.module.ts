import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "../../database/models/category.model";
import { categoryController } from "./category.controller";
import { categoryService } from "./category.service";
import { s3Module } from "../s3/s3.module";

@Module({
  imports: [
    s3Module,
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
    ])
  ],
  controllers: [categoryController],
  providers: [categoryService],
  exports: [categoryService],
})

export class categoryModule {}