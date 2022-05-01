import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, MinLength, MaxLength, IsString, Validate, IsBoolean } from "class-validator";
import { ValidatePasswordRule } from "../../../common/validate/password.validate";

export class RegisterUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E1' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E26' })
  @MinLength(8)
  @MaxLength(256)
  @Validate(ValidatePasswordRule)
  password: string

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  username: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  term: boolean;
}

export class BuyerLoginDto {
  @ApiProperty({ required: true })
  @IsString()
  networkAddress: string;
}