import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Post, Get, HttpCode, HttpStatus, Body, UploadedFile, UseInterceptors, Query } from "@nestjs/common";
import { Auth } from "../../common/decorator/auth.decorator";
import { CurrentUser } from "../../common/decorator/user.decorator";
import { collectionService } from "./collection.service";
import { CreateCollectionDto, filterCollectionUserDto } from "./dto/collection.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Collection')
@Controller('collection')
export class collectionController {
  constructor(
    private readonly collectionService: collectionService
  ) {
  }

  @Post()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'create new collection' })
  @UseInterceptors(FileInterceptor('fileLogo'))
  async createNewCollection(@CurrentUser() user, @Body() data: CreateCollectionDto,@UploadedFile() file) {
    return this.collectionService.createNewCollection(user, data, file);
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get collection of user' })
  async getCollectionOfUser(@CurrentUser() user, @Query() data: filterCollectionUserDto) {
    return this.collectionService.getListCollectionOfUser(user, data);
  }
}