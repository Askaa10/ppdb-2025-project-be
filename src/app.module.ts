import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { JwtAccessTokenStrategy } from './app/auth/jwtAccessToken.Strategy';
import { JwtGuardRefreshToken } from './app/auth/auth.guard';
import { UploadModule } from './app/upload/upload.module';
import { UploadController } from './app/upload/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { DashboardModule } from './app/dashboard/dashboard.module';
import { PendaftarModule } from './app/pendaftaran/pendaftaran.module';
import { PendaftarController } from './app/pendaftaran/pendaftaran.controller';
import { QuestionModule } from './app/question/question.module';
import { AnswerModule } from './app/answer/answer.module';
import { QuestionController } from './app/question/question.controller';
import { AnswerController } from './app/answer/answer.controller';
import { typeOrmConfig } from './config/typeorm.config';
import { CekKelulusanModule } from './app/kelulusan/kelulusan.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // konfigurasi is global untuk semua module
    }),
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
  controllers: [AppController, UploadController,PendaftarController,QuestionController  ],
  providers: [AppService, JwtAccessTokenStrategy, JwtGuardRefreshToken, ],

})
export class AppModule {}