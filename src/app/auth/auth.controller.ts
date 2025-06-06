import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResetPasswordDto, UpdateUserDto } from './auth.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { promises } from 'dns';
import { ResponseSuccess } from 'src/interface/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }

  // const link = `http://localhost:5002/auth/reset-password/${user.id}/${token}`;

  @Post('reset-password/:id/:token')
  async resetPassword(
    @Param('id', ParseIntPipe) user_id: number,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user_id, token, payload);
  }

  @Post('social-login')
  async socialLogin(@Body() payload: any) {
    return this.authService.socialLogin(payload);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    const { id } = req.user;
    return this.authService.myProfile(id);
  }

  @Put('me')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar')) // nama harus sama dengan FormData
  updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
    @Req() req: any,
  ) {
    const data: any = { ...body };
    if (file) {
      data.avatar = file.filename; // atau path, tergantung penyimpananmu
    }

    return this.authService.updateProfile(req.user.id, data);
  }
}
