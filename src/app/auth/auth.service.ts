import { IsEmail } from 'class-validator';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from 'src/utils/response.utils';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { User } from './auth.entity';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { ResponseSuccess } from 'src/interface/response.interface';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { ResetPassword } from './reset_password.entity';
import { promises } from 'dns';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>, // inject repository reset password
    private jwtService: JwtService,
  ) {
    super();
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  // register
  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    // mengecek apakah email sudah ada atau belum ?
    const checkUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (checkUserExist) {
      throw new HttpException('Email sudah digunakan', HttpStatus.FOUND);
    }

    //hash password
    payload.password = await hash(payload.password, 12);
    //hash password
    await this.authRepository.save(payload);
    return this._success('Register Berhasil');
  }

  // login
  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    ); // compare password yang dikirim dengan password yang ada di tabel
    if (checkPassword) {
      const jwtPayload = {
        id: checkUserExists.id,
        nama: checkUserExists.nama,
        email: checkUserExists.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        process.env.ACCESS_TOKEN_SECRET,
      );

      const refresh_token = await this.generateJWT(
        jwtPayload,
        '1d',
        process.env.refresh_token_secret,
      );
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExists.id,
      });
      return this._success('Login Success', {
        ...checkUserExists,
        access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email atau password salah',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  //FITUR REFRESH TOKEN
  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      process.env.ACCESS_TOKEN_SECRET,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '1d',
      process.env.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  //FITUR FORGOT PASSWORD
  async forgotPassword(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    const link = `${process.env.BASE_CLIENT_URL_FRONT}/auth/reset-password/${user.id}/${token}`; //membuat link untuk reset password
    console.log(link);
    // await this.mailService.sendForgotPassword({
    //   email: email,
    //   name: user.nama,
    //   link: link,
    // });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._success(link);
  }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({    //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        user: {
          id: user_id,
        },
        token: token,
      },
    });

    if (!user_id || !token) {
      throw new HttpException(
        'Parameter tidak valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({  // ubah password lama dengan password baru
      id: user_id,
      password: payload.new_password,
    });
    await this.resetPasswordRepository.delete({ // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }
  // login dengan google
  async socialLogin(payload: any): Promise<ResponseSuccess> {
    // Cek apakah user dengan email ini sudah terdaftar
    let user = await this.authRepository.findOne({
      where: { email: payload.email },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    // Jika belum ada, daftarkan user
    if (!user) {
      user = await this.authRepository.save(payload);
    }

    const jwtPayload: jwtPayload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      process.env.ACCESS_TOKEN_SECRET,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '1d',
      process.env.ACCESS_TOKEN_SECRET,
    );

    // Update refresh_token di database
    await this.authRepository.update(
      { id: user.id },
      { refresh_token: refresh_token },
    );

    return this._success('login success', {
      ...user,
      access_token,
      refresh_token,
    });
  }

  // async getProfile(id: number): Promise<ResponseSuccess> {
  //   const user = await this.authRepository.findOne({
  //     where: {
  //       id: id,
  //     },
  //     select: {
  //       id: true,
  //       nama: true,
  //       email: true,
  //       password: true,
  //       refresh_token: true,
  //     },
  //   });
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   return this._success('Success', user);
  // }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });
 
    return this._success('OK', user);
  }
 
}
