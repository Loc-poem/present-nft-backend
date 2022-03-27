import { AppConfig } from "../contants/app-config";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

export class Utils {
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
}