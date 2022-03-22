import { Body, HttpCode, HttpStatus, Post, Put, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { authService } from "./auth.service";
import { LoginUserDto } from "./dto/login.dto";
import { ResendVerifyOtpDto, VerifyOtpcodeDto } from "./dto/verify.dto";
import { AddWalletUserDto, UpdateUserDto } from "./dto/update-user.dto";
import { Auth } from "../../common/decorator/auth.decorator";
import { CurrentUser } from "../../common/decorator/user.decorator";

@ApiTags('Auth')
@Controller('auth')
export class authController {
  constructor(
    private readonly authService: authService,
  ) {
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: ' register user ' })
  async registerUser(@Body() data: RegisterUserDto) {
    return this.authService.registerUser(data);
  }

  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login user' })
  async loginUser(@Body() data: LoginUserDto) {
    return this.authService.loginUser(data);
  }

  @Put('logout-user')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'logout user' })
  async logoutUser(@Request() request) {
    return this.authService.logout(request);
  }

  @Post('verify-otp-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'verify otp code to verify account' })
  async verifyOtpCode(@Body() data: VerifyOtpcodeDto) {
    return this.authService.verifyOtpCode(data);
  }

  @Post('resend-otp-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'resend otp code to verify account' })
  async resendOtpCode(@Body() data: ResendVerifyOtpDto) {
    return this.authService.resendVerifyAccount(data);
  }

  @Post('verify-otp-code-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'verify otp code to reset password' })
  async verifyOtpCodePassword(@Body() data: VerifyOtpcodeDto) {
    return this.authService.verifyCodeForgotPassword(data);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'send otp code to reset password' })
  async sendOtpCodePassword(@Body() data: ResendVerifyOtpDto) {
    return this.authService.sendVerifyCodePassword(data);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'reset password' })
  async resetPassword(@Body() data: LoginUserDto) {
    return this.authService.resetPassword(data);
  }

  @Put('update-information-user')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "update user information" })
  async updateUserInfo(@Body() data: UpdateUserDto, @CurrentUser() user) {
    return this.authService.updateUserInfo(data, user);
  }

  @Put('update-wallet-user')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update wallet for user' })
  async addWalletUser(@CurrentUser() user,@Body() data: AddWalletUserDto) {
    return this.authService.addWalletUser(data,user);
  }
}