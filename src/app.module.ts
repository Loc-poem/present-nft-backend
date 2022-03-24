import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from "./database/database.module";
import { JwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { authModule } from "./modules/auth/auth.module";
import { userModule } from "./modules/user/user.module";

@Module({
  imports: [
    DatabaseModule,
    authModule,
    userModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
