import { AppConfig } from "../contants/app-config";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import * as randomize from 'randomatic';
import * as crypto from 'crypto'
import BigNumber from 'bignumber.js';
import { ObjectID } from 'mongodb';

export class Utils {
  public static getUniqueArray(data: any[]) {
    return data.filter((v, i, a) => a.indexOf(v) === i);
  }

  public static escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  public static generateOTP() {
    return Math.random().toFixed(6).substr(-6)
  }

  public static hashPassword(password: string) {
    return bcrypt.hash(password, AppConfig.SALT_ROUND);
  }

  public static generateToken(user: any, jwtService: JwtService) {
    const payload = { _id: user._id, role: 'user', userName: user.username, email: user.email};
    return jwtService.sign(payload);
  }

  public static decodeJwtService(jwt: string, jwtService: JwtService) {
    const jwtArray = jwt.split(' ');
    return jwtService.decode(jwtArray[1]);
  }

  public static getUrlCode() {
    const urlCode = new Date().getTime().toString();
    return urlCode;
  }

  public static randomUrlCode(urlCode: string) {
    let code = urlCode + '-' + randomize('0', Math.floor(Math.random() * 11) + 1);
    return code;
  }

  public static stripHtml(html: string) {
    if (!html) {
      return;
    }
    let result = html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/gi, ' ');
    return result;
  }

  public static generateTokenId() {
    const hex = crypto.createHash('sha256').update((new ObjectID()).toHexString() + new Date().getTime()).digest('hex');
    const keys3 = new BigNumber(hex.toString(), 16).toString();
    return { tokenId: hex, keys3 };
  }
}