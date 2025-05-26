import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './app/auth/auth.module';
import { UploadModule } from './app/upload/upload.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { PendaftarModule } from './app/pendaftaran/pendaftaran.module';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { QuestionModule } from './app/question/question.module';
import { AnswerModule } from './app/answer/answer.module';
import { CekKelulusanModule } from './app/kelulusan/kelulusan.module';
import { AppController } from './app.controller';
import { UploadController } from './app/upload/upload.controller';
import { AppService } from './app.service';
import { JwtAccessTokenStrategy } from './app/auth/jwtAccessToken.Strategy';
import { JwtGuardRefreshToken } from './app/auth/auth.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { typeOrmConfig } = await import('./config/typeorm.config');
        return typeOrmConfig;
      },
    }),
    AuthModule,
    UploadModule,
    CloudinaryModule,
    PendaftarModule,
    DashboardModule,
    QuestionModule,
    AnswerModule,
    CekKelulusanModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, JwtAccessTokenStrategy, JwtGuardRefreshToken],
})
export class AppModule {}
