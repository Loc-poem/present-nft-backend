import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { FILE_TYPE } from "../../../database/models/artwork.model";
import { Type } from "class-transformer";

export class createArtworkDto {
  @ApiProperty({ required: true })
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ required: true, nullable: false, description: 'image => image, audio => audio, video => video, 3d => 3d' })
  @IsOptional({ message: 'E26' })
  @IsEnum(FILE_TYPE)
  @IsString()
  fileType: FILE_TYPE;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  filePreview: any;

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  name: string;

  @ApiProperty({ required: true, nullable: false })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  numberOfCopies: number;

  @ApiProperty({ required: true, nullable: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(50)
  royaltyFee: number

  @ApiProperty({ required: true, nullable: false, description: 'ObjectID1,ObjectID2,...', })
  @IsNotEmpty()
  @IsString()
  categoriesId: string

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(6000)
  description: string

  @ApiProperty({ required: false, nullable: false, description: '0 => false (hide), 1 => true (show)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  show: number;

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  collectionId: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  contractAddress: string;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => String)
  urlCode: string;
}