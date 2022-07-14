import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class filterGetListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  show: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  collectionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contractAddress: string;

  @ApiProperty({ required: false, description: 'OFF_SALE = 1, ON_SALE = 2, SOLD_OUT = 3' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'E0' })
  sortField: string;

  @ApiProperty({ required: false, description: '-1 => DESC, 1 => ASC' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortType: number;
}