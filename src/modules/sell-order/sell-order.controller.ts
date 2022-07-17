import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { sellOrderService } from "./sell-order.service";
import { Auth } from "../../common/decorator/auth.decorator";
import { CurrentUser } from "../../common/decorator/user.decorator";
import { createSellOrderDto } from "./dto/sell-order.dto";

@Controller('sell-order')
@ApiTags('sell order')
export class sellOrderController {
  constructor(
    private readonly sellOrderService: sellOrderService,
  ) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "create sell order" })
  createArtwork(@CurrentUser() user, @Body() data: createSellOrderDto) {
    return this.sellOrderService.createArtwork(user, data);
  }
}