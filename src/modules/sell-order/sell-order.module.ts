import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SellOrderSchema } from "../../database/models/sell-order.model";
import { sellOrderService } from "./sell-order.service";
import { sellOrderController } from "./sell-order.controller";
import { artworkModule } from "../artwork/artwork.module";
import { ipfsModule } from "../ipfs/ipfs.module";
import { ArtworkSchema } from "../../database/models/artwork.model";
import { UserSchema } from "../../database/models/user.model";

@Module({
  imports: [
    artworkModule,
    ipfsModule,
    MongooseModule.forFeature([
      { name: 'SellOrder', schema: SellOrderSchema },
      { name: 'Artwork', schema: ArtworkSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  exports: [sellOrderService],
  providers: [sellOrderService],
  controllers: [sellOrderController],
})

export class sellOrderModule {}