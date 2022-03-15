import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class VerifyOtpcodeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E1' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'E1' })
  otpCode: string;
}

export class ResendVerifyOtpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E1' })
  @IsEmail()
  email: string;
}
