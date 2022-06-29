import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus, Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { Auth } from "../../common/decorator/auth.decorator";
import { artworkService } from "./artwork.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../../common/decorator/user.decorator";
import { createArtworkDto } from "./dto/artwork.dto";
import { ApiError } from "../../common/response/api-error";
import { AppConfig } from "../../common/contants/app-config";
import { filterGetListDto } from "./dto/filter-artwork.dto";

@ApiTags('Artwork')
@Controller('artwork')
export class artworkController {
  constructor(
    private readonly artworkService: artworkService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "create artwork" })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'filePreview', maxCount: 1 }
  ]))
  createArtWork(@CurrentUser() user, @Body() data: createArtworkDto,@UploadedFiles() files: Express.Multer.File[],) {
    const file = files['file'][0];
    const filePreview = files['filePreview'] ? files['filePreview'][0] : null;
    if (data.fileType !== '3d' && AppConfig.FILE_ARTWORK_UPLOAD.indexOf(file.mimetype) === -1)
      throw ApiError.error('Invalid file type.', 'E0', { field: 'file' });

    if (data.fileType !== '3d' && file.size > AppConfig.MAX_FILE_UPLOAD)
      throw new ApiError('Invalid file size.', 'E18', { field: 'file' });

    if (filePreview && AppConfig.FILE_ARTWORK_UPLOAD.indexOf(filePreview.mimetype) === -1)
      throw ApiError.error('Invalid file type.', 'E0', { field: 'file' });

    if (filePreview && filePreview.size > AppConfig.MAX_FILE_UPLOAD)
      throw new ApiError('Invalid file size.', 'E18', { field: 'file' });
    return this.artworkService.createArtwork(user, data, file, filePreview);
  }

  @Get('store-list')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOperation({ summary: 'get list artwork of user' })
  getListArtwork(@CurrentUser() user, @Query() filter: filterGetListDto) {
    return this.artworkService.getListArtwork(user, filter);
  }

  @Get('artwork/:id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOperation({ summary: 'get detail of artwork' })
  getDetailArtwork(@CurrentUser() user, @Param('id') id: string) {
    return this.artworkService.getDetail(user, id);
  }
}