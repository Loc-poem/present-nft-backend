import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength, IsOptional, IsString, IsMongoId, IsNumber } from "class-validator";

export class CreateCollectionDto {
  @ApiProperty({ required: true, nullable: false, description: '1 => ERC 721, 2 => ERC 1155' })
  @IsNotEmpty()
  @Type(() => Number)
  type: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileLogo: any;

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty({ message: 'MSG_2' })
  @MaxLength(256, { message: 'E15' })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(6000, { message: 'E0' })
  description: string

  @ApiProperty({ required: true, type: 'string', nullable: false })
  @IsNotEmpty({ message: 'E26' })
  @IsString()
  contractAddress: string;

  @ApiProperty({ required: false, type: 'string', nullable: true })
  urlCode: string;

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty({ message: 'MSG_2' })
  @Type(() => Number)
  networkType: number;

  @ApiProperty({ required: true, type: 'string', nullable: false })
  @IsNotEmpty({ message: 'E26' })
  @IsString()
  txId: string;

  @ApiProperty({ required: true })
  @IsString()
  symbol: string;
}

export class filterCollectionUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'E0' })
  collectionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'E0' })
  sortField: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  sortType: number;

  @ApiProperty({ required: false })
  @IsOptional()
  fromDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  toDate: Date;
}

export class dataCreateCollectionDto {
  userId: string;
  logoUrl: string;
  name: string;
  type: number;
  description: string;
  urlCode: string;
  contractAddress: string;
  status: number;
  txId: string;
  creator: string;
  symbol: string;
  username: string;
  userAvtUrl: string;
}

export class UnverifyCollectionDto {
  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty({ message: 'E26' })
  @IsString()
  @IsMongoId({ message: 'E0' })
  collectionId: string;

  @ApiProperty({ required: true })
  @IsString()
  collectionSalt: string;
}