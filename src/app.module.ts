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

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
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
  ],
  controllers: [AppController, UploadController,PendaftarController],
  providers: [AppService, JwtAccessTokenStrategy, JwtGuardRefreshToken],
})
export class AppModule {}