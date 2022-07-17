import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class createSellOrderDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  userId: string;

  @ApiProperty({ required: true, nullable: false })
  @IsString()
  currencyKey: string;

  @ApiProperty({ required: true })
  @IsString()
  currencyName: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  artworkId: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000000)
  quantity: number;

  @ApiProperty({ required: true, nullable: false })
  @IsNotEmpty({ message: 'E26' })
  price: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  type: number; // 1 is instance sale, 2 is time auction

  // for time auction
  @ApiProperty({ required: false })
  @IsOptional()
  minimumBid: string; // first bid price for time auction

  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  incrementPercent: number;
}

export class DataValidateTimeAuction {
  startDate: Date;
  endDate: Date;
  minimumBid: string;
  incrementPercent: number;
}