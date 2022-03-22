import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ required: false })
  nationality: string;

  @ApiProperty({ required: false })
  city: string;

  @ApiProperty({ required: false })
  zipCode: string;

  @ApiProperty({ required: false })
  phoneNumber: string;
}

export class AddWalletUserDto {
  @ApiProperty({ required: true })
  walletAddress: string;
}