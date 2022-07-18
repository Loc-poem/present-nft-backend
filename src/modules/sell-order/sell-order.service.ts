import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  SELL_ORDER_STATUS,
  SELL_ORDER_TYPE,
  SellOrder,
  TIME_AUCTION_STATUS
} from "../../database/models/sell-order.model";
import { User } from "../../database/models/user.model";
import { createSellOrderDto, DataValidateTimeAuction } from "./dto/sell-order.dto";
import { artworkService } from "../artwork/artwork.service";
import { Artwork, ARTWORK_STATUS } from "../../database/models/artwork.model";
import { ipfsService } from "../ipfs/ipfs.service";
import { ApiError } from "../../common/response/api-error";
import { COLLECTION_TYPE } from "../../database/models/collection.model";
import { AppConfig } from "../../common/contants/app-config";
import { Web3Utils } from "../../common/utils/web3.utils";

@Injectable()
export class sellOrderService {
  constructor(
    @InjectModel('SellOrder') private readonly sellOrderModel: Model<SellOrder>,
    @InjectModel('Artwork') private readonly artworkModel: Model<Artwork>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly artworkService: artworkService,
    private readonly ipfsService: ipfsService,
  ) {}

  async createSellOrder(user, data: createSellOrderDto) {
    try {
      const { artworkId } = data;
      const artworkData = await this.artworkService.getById(artworkId);
      const dataCreate = await this.validateSellOrderData(user, data, artworkData);
      const newSellOrder = await this.sellOrderModel.create(dataCreate);
      const sellOrderId = newSellOrder._id;
      const userData = await this.userModel.findOne({ _id: user._id }).lean();
      const currentDate = new Date();
      if (newSellOrder.type === SELL_ORDER_TYPE.TIME_AUCTION) {
        switch (newSellOrder.eventStatus) {
          case TIME_AUCTION_STATUS.COMING_SOON:
            const timeToLive = newSellOrder.startDate.getTime() - currentDate.getTime();
            setTimeout(this.updateStatusOfTimeAuction.bind(this), timeToLive, sellOrderId, TIME_AUCTION_STATUS.COMING_SOON);
            break;
          case TIME_AUCTION_STATUS.LIVE:
            const timeToEnd = newSellOrder.endDate.getTime() - newSellOrder.startDate.getTime();
            setTimeout(this.updateStatusOfTimeAuction.bind(this), timeToEnd, sellOrderId, TIME_AUCTION_STATUS.LIVE);
            break;
        }
      };
      const dataSignSaleOrderMaster = {
        sellOrderID: '0x' + sellOrderId,
        sellOrderSupply: newSellOrder.saleQuantity,
        creator: userData.networkAddress,
      };
      const signSellOrderMaster = await Web3Utils.signNftSellOrderMaster(dataSignSaleOrderMaster);
      const metadata = [];
      metadata['signSaleOrderAdmin'] = signSellOrderMaster;
      await this.sellOrderModel.updateOne({ _id: newSellOrder._id }, { $set: { metadata: metadata } });
      await this.artworkModel.updateOne({ _id: artworkId },
      {
       $set: {
         status: ARTWORK_STATUS.ON_SALE,
         price: newSellOrder.price,
         sellOrderId: newSellOrder._id,
       }
      })
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

    dataCreate.startDate = convertStartDate;
    dataCreate.endDate = convertEndDate;
    dataCreate.eventStatus = convertStartDate <= currentDate ? TIME_AUCTION_STATUS.LIVE : TIME_AUCTION_STATUS.COMING_SOON;

    return dataCreate;
  }

  async updateStatusOfTimeAuction(sellOrderId: string, status: number) {
    const sellOrderData = await this.sellOrderModel.findOne({ _id: sellOrderId, type: SELL_ORDER_TYPE.TIME_AUCTION }, { status: 1, eventStatus: 1, startDate: 1, endDate: 1, expiredDate: 1, nftifyId: 1, highestBid: 1 });
    const findQuery = {
      _id: sellOrderId,
    };
    const updateQuery = {
      $set: {}
    }
    switch (status) {
      case TIME_AUCTION_STATUS.COMING_SOON:
        if (sellOrderData.status === SELL_ORDER_STATUS.ACTIVE && sellOrderData.eventStatus === TIME_AUCTION_STATUS.COMING_SOON) {
          updateQuery.$set = {
            eventStatus: TIME_AUCTION_STATUS.LIVE,
          };
          await this.sellOrderModel.updateOne(findQuery, updateQuery);
          const timeToEnd = sellOrderData.endDate.getTime() - sellOrderData.startDate.getTime();
          setTimeout(this.updateStatusOfTimeAuction.bind(this), timeToEnd, sellOrderId, TIME_AUCTION_STATUS.LIVE);
        }
        break;
      case TIME_AUCTION_STATUS.LIVE:
        if (sellOrderData.status === SELL_ORDER_STATUS.ACTIVE && sellOrderData.eventStatus === TIME_AUCTION_STATUS.LIVE) {
          if (sellOrderData.highestBid) {
            updateQuery.$set = {
              eventStatus: TIME_AUCTION_STATUS.SELECTING,
            };
            await this.sellOrderModel.updateOne(findQuery, updateQuery);
            const timeToExpired = sellOrderData.expiredDate.getTime() - sellOrderData.endDate.getTime();
            setTimeout(this.updateStatusOfTimeAuction.bind(this), timeToExpired, sellOrderId, TIME_AUCTION_STATUS.SELECTING);
          } else {
            updateQuery.$set = {
              eventStatus: TIME_AUCTION_STATUS.ENDED,
              status: SELL_ORDER_STATUS.CANCELLED,
            }
            let promiseAll = [];
            promiseAll.push(this.sellOrderModel.updateOne(findQuery, updateQuery));
            promiseAll.push(this.artworkModel.updateOne({ _id: sellOrderData.artworkId }, { $set: { status: ARTWORK_STATUS.OFF_SALE, } }));
            await Promise.all(promiseAll);
          }
        }
        break;
      case TIME_AUCTION_STATUS.SELECTING:
        if (sellOrderData.status === SELL_ORDER_STATUS.ACTIVE && sellOrderData.eventStatus === TIME_AUCTION_STATUS.SELECTING) {
          updateQuery.$set = {
            eventStatus: TIME_AUCTION_STATUS.ENDED,
            status: SELL_ORDER_STATUS.CANCELLED,
          }
          await this.sellOrderModel.updateOne(findQuery, updateQuery);
          await this.artworkModel.updateOne({ _id: sellOrderData.artworkId }, { $set: { status: ARTWORK_STATUS.OFF_SALE, } });
          //await this.userMakeOfferModel.updateMany({ sellOrderId: sellOrderId }, { $set: { status: OFFER_STATUS.EXPIRED } })
        }
        break;
    }
  }
}