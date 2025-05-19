import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./auth.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtAccessTokenStrategy } from "./jwtAccessToken.Strategy";
import { JwtGuardRefreshToken } from "./auth.guard";
import { MailerModule } from "@nestjs-modules/mailer";
import { ResetPassword } from "./reset_password.entity";
import { JwtRefreshTokenStrategy } from "./jwtRefreshToken.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetPassword]),
  JwtModule.register({}),
],
  controllers: [AuthController],
  providers: [AuthService,  JwtAccessTokenStrategy, JwtGuardRefreshToken,JwtRefreshTokenStrategy],
})
export class AuthModule {}