// import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
// import { User } from 'src/user/decorators/user.decorator';
// import { AuthService } from './auth.service';
// import { Auth } from './decorators/auth.decorator';
// import { LoginAuthDto } from './dto/login.dto';
// import { TokenDto } from './dto/token.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('register')
//   async register(@Body() dto: LoginAuthDto) {
//     return this.authService.register(dto);
//   }

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('login')
//   async login(@Body() dto: LoginAuthDto) {
//     return this.authService.login(dto);
//   }

//   @UsePipes(new ValidationPipe())
//   @HttpCode(200)
//   @Post('access')
//   async getNewTokens(@Body() dto: TokenDto) {
//     return this.authService.getNewTokens(dto);
//   }

//   @HttpCode(200)
//   @Post('check-user')
//   async checkUser(@Body() dto: { email: string }) {
//     return this.authService.checkUser(dto.email);
//   }

//   @HttpCode(200)
//   @Get('check-instructor')
//   @Auth('INSTRUCTOR')
//   async checkInstructo(@User('_id') _id: string) {
//     return _id ? true : false;
//   }
// }


// import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { OneIdService } from './oneid.service';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly oneIdService: OneIdService,
//   ) {}

//   @Post('oneid/callback')
//   async handleOneIdCallback(@Body() body: { code: string }) {
//     try {
//       const { code } = body;
      
//       if (!code) {
//         throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
//       }

//       // 1. OneID serveridan access_token olish
//       const accessToken = await this.oneIdService.getAccessToken(code);

//       // 2. Access token orqali user ma'lumotlarini olish
//       const oneIdUserData = await this.oneIdService.getUserInfo(accessToken);

//       // 3. User ma'lumotlarini database ga saqlash va JWT token generatsiya qilish
//       const result = await this.authService.processOneIdUser(oneIdUserData);

//       return {
//         success: true,
//         token: result.token,
//         user: result.user,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'OneID authentication failed',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }


// ********************************
import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe, HttpException, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/decorators/user.decorator';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { TokenDto } from './dto/token.dto';
import { OneIdLogoutDto } from './dto/oneid-logout.dto';
import { OneIdService } from './oneid.service';
import { UserActivityLogger } from 'src/logger/user-activity.logger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oneIdService: OneIdService,
    private readonly userActivityLogger: UserActivityLogger,
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('access')
  async getNewTokens(@Body() dto: TokenDto) {
    return this.authService.getNewTokens(dto);
  }

  @HttpCode(200)
  @Post('check-user')
  async checkUser(@Body() dto: { email: string }) {
    // Email bilan tekshirish endi qo'llab-quvvatlanmaydi
    return { status: 'disabled' } as const;
  }

  @HttpCode(200)
  @Get('check-instructor')
  @Auth('INSTRUCTOR')
  async checkInstructor(@User('_id') _id: string) {
    return _id ? true : false;
  }

  /**
   * Logout endpoint - Token ni blacklist ga qo'shish
   * Logout qilganda token darhol invalid bo'ladi
   */
  @HttpCode(200)
  @Post('logout')
  @Auth() // JWT token talab qilinadi
  async logout(@Req() req: Request) {
    try {
      // Request header dan token ni olish
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.replace('Bearer ', '');
      
      // Cookie dan refresh token ni olish
      const refreshToken = req.cookies?.refresh || null;

      if (!accessToken) {
        throw new HttpException('Token topilmadi', HttpStatus.BAD_REQUEST);
      }

      // Token ni blacklist ga qo'shish
      await this.authService.logout(accessToken, refreshToken);

      // Log yozish
      this.userActivityLogger.logUserActivity({
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: (req.headers['user-agent'] as string) || '-',
        referer: (req.headers['referer'] as string) || '-',
        statusCode: 200,
        action: 'LOGOUT',
        message: 'Foydalanuvchi tizimdan chiqdi',
      });

      return {
        success: true,
        message: 'Muvaffaqiyatli tizimdan chiqildi',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Logout xatolik yuz berdi',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // OneID uchun yangi endpoint
  @HttpCode(200)
  @Post('oneid/callback')
  async handleOneIdCallback(@Body() body: { code: string }, @Req() req: Request) {
    try {
      const { code } = body;
      
      if (!code) {
        throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
      }

      // 1. OneID serveridan access_token olish
      const accessToken = await this.oneIdService.getAccessToken(code);
      console.log("FROM accessToken");
      

      // 2. Access token orqali user ma'lumotlarini olish
      const oneIdUserData = await this.oneIdService.getUserInfo(accessToken);
      console.log("FROM oneIdUserData");

      // 3. User ma'lumotlarini database ga saqlash va JWT token generatsiya qilish
      const result = await this.authService.processOneIdUser(oneIdUserData);

      // Odam o'qiydigan xabar bilan log yozish
      this.userActivityLogger.logUserActivity({
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: (req.headers['user-agent'] as string) || '-',
        referer: (req.headers['referer'] as string) || '-',
        statusCode: 200,
        email: result.user?.email,
        userId: result.user?.id?.toString?.(),
        fullName: result.user?.fullName || oneIdUserData.full_name,
        role: result.user?.role,
        action: 'ONEID_AUTH',
        message: `${result.user?.fullName || oneIdUserData.full_name} OneID orqali ro'yxatdan o'tdi`,
      });

      return {
        success: true,
        ...result, // user va tokenlar
        oneIdAccessToken: accessToken, // OneID access_token ni frontendga qaytarish (logout uchun)
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'OneID authentication failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * OneID orqali foydalanuvchini tizimdan chiqarish (logout)
   * Access token orqali OneID serverida session ni invalid qilish
   */
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('oneid/logout')
  async handleOneIdLogout(@Body() dto: OneIdLogoutDto, @Req() req: Request) {
    try {
      const { access_token } = dto;

      if (!access_token) {
        throw new HttpException('Access token talab qilinadi', HttpStatus.BAD_REQUEST);
      }

      // OneID serveriga logout so'rov yuborish
      const logoutResult = await this.oneIdService.logout(access_token);

      // Odam o'qiydigan xabar bilan log yozish
      this.userActivityLogger.logUserActivity({
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: (req.headers['user-agent'] as string) || '-',
        referer: (req.headers['referer'] as string) || '-',
        statusCode: 200,
        action: 'ONEID_LOGOUT',
        message: 'OneID orqali foydalanuvchi tizimdan chiqdi',
      });

      return {
        success: true,
        message: 'Muvaffaqiyatli tizimdan chiqildi',
        data: logoutResult,
      };
    } catch (error) {
      // Xatolikni log qilish
      this.userActivityLogger.logUserActivity({
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: (req.headers['user-agent'] as string) || '-',
        referer: (req.headers['referer'] as string) || '-',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        action: 'ONEID_LOGOUT_ERROR',
        message: `OneID logout xatolik: ${error.message}`,
      });

      throw new HttpException(
        error.message || 'OneID logout xatolik yuz berdi',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}