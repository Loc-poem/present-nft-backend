import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post, Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { categoryService } from "./category.service";
import { Auth } from "../../common/decorator/auth.decorator";
import { CurrentUser } from "../../common/decorator/user.decorator";
import { createCategoryDto, deleteCategoryDto, filterCategoryDto } from "./dto/category.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Category')
@Controller('category')
export class categoryController {
  constructor(
    private readonly categoryService: categoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  @ApiOperation({ summary: 'admin create category' })
  create(@CurrentUser() user,@Body() data: createCategoryDto,@UploadedFile() file: Express.Multer.File) {
    return this.categoryService.create(user, data, file);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOperation({ summary: 'admin delete category' })
  delete(@CurrentUser() user,@Body() data: deleteCategoryDto) {
    return this.categoryService.delete(user, data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list of category' })
  getList(@Query() filter: filterCategoryDto) {
    return this.categoryService.getList(filter);
  }
}