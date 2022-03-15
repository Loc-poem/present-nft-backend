import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, MinLength, MaxLength, Validate, IsOptional, IsString } from "class-validator";
import { ValidatePasswordRule } from "../../../common/validate/password.validate";

export class LoginUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'E1' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(256)
  @Validate(ValidatePasswordRule)
  password: string;
}