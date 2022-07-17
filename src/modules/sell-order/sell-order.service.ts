import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SELL_ORDER_STATUS, SELL_ORDER_TYPE, SellOrder } from "../../database/models/sell-order.model";
import { createSellOrderDto, DataValidateTimeAuction } from "./dto/sell-order.dto";
import { artworkService } from "../artwork/artwork.service";
import { Artwork } from "../../database/models/artwork.model";
import { ipfsService } from "../ipfs/ipfs.service";
import { ApiError } from "../../common/response/api-error";
import { COLLECTION_TYPE } from "../../database/models/collection.model";
import { AppConfig } from "../../common/contants/app-config";

@Injectable()
export class sellOrderService {
  constructor(
    @InjectModel('SellOrder') private readonly sellOrderModel: Model<SellOrder>,
    private readonly artworkService: artworkService,
    private readonly ipfsService: ipfsService,
  ) {}

  async createArtwork(user, data: createSellOrderDto) {
    try {
      const { artworkId } = data;
      const artworkData = await this.artworkService.getById(artworkId);
      const dataCreate = await this.validateSellOrderData(user, data, artworkData);
      const newSellOrder = await this.sellOrderModel.create(dataCreate);
      const sellOrderId = newSellOrder._id;
      const currentDate = new Date();
    } catch (e) {
      throw new ApiError("Error" + e, "E-1");
    }
  }

  async validateSellOrderData(user, data, artwork) {
    const { artworkId, quantity, type, incrementPercent, minimumBid, startDate, endDate} = data;
    let { price, currencyKey, currencyName } = data;
    if (!price && minimumBid) price = minimumBid;
    if(!artwork.ipfsCid || !artwork.uri){
      await this.ipfsService.uploadFromSource(artwork);
    };
    if (artwork.numberOfCopies < quantity) throw new ApiError('quantity invalid.', 'E-1');
    currencyKey = process.env.CURRENCY_KEY;
    currencyName = process.env.CURRENCY_NAME;
    let fee = parseInt(process.env.DEFAULT_SERVICEFEE);
    const saltAdmin = new Date().getTime();
    let dataCreate = {
      userId: user._id,
      artworkId,
      saleQuantity: quantity,
      soldQuantity: 0,
      price: price, // with case Time Auction , price = minimum bid
      fee,
      status: SELL_ORDER_STATUS.ACTIVE,
      currencyKey,
      currencyName,
      chainId: parseInt(process.env.BSC_CHAIN),
      type,
    } as any;
    if (type === SELL_ORDER_TYPE.TIME_AUCTION) {
      const dataValidate = new DataValidateTimeAuction();
      dataValidate.startDate = startDate;
      dataValidate.endDate = endDate;
      dataValidate.minimumBid = minimumBid;
      dataValidate.incrementPercent = incrementPercent;
      dataCreate = this.validateTimeSellOrder(dataCreate, artwork, dataValidate);
    };

    return dataCreate;
  }

  validateTimeSellOrder(dataCreate, artwork, dataValidate) {
    const { startDate, endDate, minimumBid, incrementPercent } = dataValidate;
    const currentDate = new Date();
    if (!startDate || !endDate) throw new ApiError("Time auction need end date and start date", "E-1");
    const convertStartDate = new Date(startDate);
    const convertEndDate = new Date(endDate);
    const validEndDate = (convertEndDate > currentDate && convertEndDate > convertStartDate);
    if (!validEndDate) {
      throw new ApiError("Invalid time auction data", "E91");
    }
    dataCreate.saleQuantity = 1;
    if (artwork.type !== COLLECTION_TYPE.ERC_721) throw new ApiError("NFT must be ERC_721", "E-1");
    const validBid = minimumBid ? parseFloat(minimumBid) > 0 : false;
    if (!validBid) throw new ApiError("Price must be greater than 0", "E40");
    const validIncrement = incrementPercent ? (incrementPercent >= AppConfig.MINIMUM_INCREMENT_PERCENT && incrementPercent <= AppConfig.MAXIMUM_INCREMENT_PERCENT) : false;
    if (!validIncrement) throw new ApiError("Please enter a valid value. Minimum value is 5% and Maximum value is 100%", "E78");

    const expiredDate = new Date(endDate);

    const expiredDateConvert = expiredDate.setDate(expiredDate.getDate() + AppConfig.EXPIRED_DAY);
    dataCreate.expiredDate = expiredDateConvert;
    dataCreate.incrementPercent = incrementPercent;
    dataCreate.quantity = 1;
    dataCreate.minimumBid = minimumBid;
    return dataCreate;
  }
}