import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class createCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  iconUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  icon: any;
}

export class deleteCategoryDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  categoryId: string;
}

export class filterCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  categoryId: string;

  @ApiProperty({ required: false, description: '1 => ON, 2 => OFF' })
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