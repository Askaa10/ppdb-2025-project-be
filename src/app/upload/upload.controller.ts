import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import * as fs from 'fs';
import { JwtGuard } from '../auth/auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { v2 as cloudinary } from 'cloudinary';
import { BaseResponse } from 'src/utils/response.utils';
import { ResponseSuccess } from 'src/interface/response.interface';
import * as dotenv from 'dotenv';


 
@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor(private readonly cloudinaryService: CloudinaryService)  {
    super();
  }

  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 20, { // Maksimum 20 file
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${Date.now()}.${fileExtension}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // Maksimum 2MB per file
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
        ];
  
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new HttpException(`File ${file.originalname} tidak valid! Hanya gambar dan PDF yang diperbolehkan.`, HttpStatus.BAD_REQUEST), false);
        }
  
        if (file.size > 2 * 1024 * 1024) {
          return cb(new HttpException(`File ${file.originalname} terlalu besar! Maksimum 2MB per file.`, HttpStatus.BAD_REQUEST), false);
        }

        cb(null, true);
      },
    }),
  )
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    try {
      const file_response = files.map((file) => ({
        file_url:` ${process.env.BASE_SERVER_URL}/uploads/${file.filename}`,
        file_name: file.filename,
        file_size: file.size,
      }));
  
      return this._success('OK', {
        files: file_response,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // Maksimum 2MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
        ];
        
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new HttpException('Hanya file gambar dan PDF yang diperbolehkan', HttpStatus.BAD_REQUEST), false);
        }
  
        if (file.size > 2 * 1024 * 1024) {
          return cb(new HttpException('Ukuran file tidak boleh lebih dari 2MB', HttpStatus.BAD_REQUEST), false);
        }
  
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    try {
      const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
      return this._success('OK', {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      const filePath = `public/uploads/${filename}`;
      fs.unlinkSync(filePath);
      return this._success('Berhasil menghapus File');
    } catch (err) {
      throw new HttpException('File not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('file/cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }
  

  @Delete('cloudinary/:publicId')
  async deleteCloudinaryFile(@Param('publicId') publicId: string): Promise<ResponseSuccess> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new HttpException('Gagal menghapus file di Cloudinary', HttpStatus.BAD_REQUEST);
      }
      return this._success('Berhasil menghapus file dari Cloudinary');
    } catch (err) {
      throw new HttpException('File tidak ditemukan atau sudah dihapus', HttpStatus.NOT_FOUND);
    }
  }
}