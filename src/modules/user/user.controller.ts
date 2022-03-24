import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { userService } from "./user.service";
import { Auth } from "../../common/decorator/auth.decorator";
import { CurrentUser } from "../../common/decorator/user.decorator";

@ApiTags('User')
@Controller('user')
export class userController {
  constructor(
    private readonly userService: userService
  ) {
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get user infomation' })
  async getUserInformation(@CurrentUser() user) {
    return this.userService.getUserInformation(user);
  }
}