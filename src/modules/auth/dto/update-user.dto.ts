import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ required: true })
  nationality: string;

  @ApiProperty({ required: true })
  city: string;

  @ApiProperty({ required: true })
  zipCode: string;

  @ApiProperty({ required: true })
  phoneNumber: string;
}

export class AddWalletUserDto {
  @ApiProperty({ required: true })
  walletAddress: string;
}