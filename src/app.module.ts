import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from "./database/database.module";
import { JwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { authModule } from "./modules/auth/auth.module";
import { userModule } from "./modules/user/user.module";
import { collectionModule } from "./modules/collection/collection.module";
import { join } from "path";
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppConfig } from "./common/contants/app-config";
import { artworkModule } from "./modules/artwork/artwork.module";
import { categoryModule } from "./modules/category/category.module";
import { sellOrderModule } from "./modules/sell-order/sell-order.module";

@Module({
  imports: [
    DatabaseModule,
    authModule,
    userModule,
    collectionModule,
    artworkModule,
    categoryModule,
    sellOrderModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        },
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', AppConfig.STATIC_DIR),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
