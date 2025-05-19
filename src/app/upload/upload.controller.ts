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
    import { JwtGuard } from '../auth/auth.guard';
    import { BaseResponse } from 'src/utils/response.utils';
    import * as fs from 'fs';
    import { ResponseSuccess } from 'src/interface/response.interface';
    import { CloudinaryService } from '../cloudinary/cloudinary.service';

    @UseGuards(JwtGuard)
    @Controller('upload')
    export class UploadController extends BaseResponse {
    constructor(private readonly cloudinaryService: CloudinaryService) {
        super();
    }

    @UseInterceptors(
        FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: 'public/uploads',
            filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            cb(null, `${new Date().getTime()}.${fileExtension}`);
            },
        }),
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (
            !allowedTypes.includes(file.mimetype) ||
            file.size > 2 * 1024 * 1024
            ) {
            return cb(
                new HttpException(
                `Hanya file gambar dan pdf yang berukuran kurang dari 2MB yang bisa di upload, file ${file.originalname} tidak sesuai`,
                HttpStatus.BAD_REQUEST,
                ),
                false,
            );
            }
            return cb(null, true);
        },
        }),
    )
    @Post('file')
    async uploadFileArray(
        @UploadedFiles() files: Array<Express.Multer.File>,
    ): Promise<ResponseSuccess> {
        try {
        const urls = files.map(
            (file) => `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`,
        );
        return this._success('OK', {
            file: files.map((file, index) => ({
            file_url: urls[index],
            file_name: file.filename,
            file_size: file.size,
            })),
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

    @Post('cloudinary')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }

    @Delete('cloudinary/delete/:public_id')
    async deleteImage(@Param('public_id') public_id: string) {
        return this.cloudinaryService.deleteImage(public_id);
    }
    }
