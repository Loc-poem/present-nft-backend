import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SellOrderSchema } from "../../database/models/sell-order.model";
import { sellOrderService } from "./sell-order.service";
import { sellOrderController } from "./sell-order.controller";
import { artworkModule } from "../artwork/artwork.module";
import { ipfsModule } from "../ipfs/ipfs.module";

@Module({
  imports: [
    artworkModule,
    ipfsModule,
    MongooseModule.forFeature([
      { name: 'SellOrder', schema: SellOrderSchema }
    ]),
  ],
  exports: [sellOrderService],
  providers: [sellOrderService],
  controllers: [sellOrderController],
})

export class sellOrderModule {}