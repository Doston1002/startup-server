import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as SendGrid from '@sendgrid/mail';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { Books, BooksDocument } from 'src/books/books.model';
import { User, UserDocument } from 'src/user/user.model';
import { Otp, OtpDocument } from './otp.model';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Books.name) private booksModel: Model<BooksDocument>,
    private readonly configService: ConfigService,
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async sendOtpVerification(email: string, isUser: boolean) {
    if (!email) throw new ForbiddenException('email_is_required');

    if (isUser) {
      const existUser = await this.userModel.findOne({ email });
      if (!existUser) throw new UnauthorizedException('user_not_found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const salt = await genSalt(10);
    const hashedOtp = await hash(String(otp), salt);
    const emailData = {
      to: email,
      subject: 'Verification email',
      from: 'togaevn14@gmail.com',
      html: `
				<h1>Verification Code: ${otp}</h1>
			`,
    };
    
    try {
      await this.otpModel.create({ email: email, otp: hashedOtp, expireAt: Date.now() + 3600000 });
      await SendGrid.send(emailData);
      return 'Success';
    } catch (error) {
      // SendGrid xatolarni handle qilish
      if (error.response) {
        const { statusCode, body } = error.response;
        console.error('SendGrid Error:', { statusCode, body });
        
        if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Email xizmati sozlashda xatolik. Iltimos, administrator bilan bog\'laning.');
        }
        
        throw new BadRequestException(`Email yuborishda xatolik: ${body?.message || 'Noma'lum xatolik'}`);
      }
      
      throw new BadRequestException('Email yuborishda xatolik yuz berdi');
    }
  }

  async verifyOtp(email: string, otpVerification: string) {
    if (!otpVerification) throw new BadRequestException('send_otp_verification');

    const userExistOtp = await this.otpModel.find({ email });
    const { expireAt, otp } = userExistOtp.slice(-1)[0];

    if (expireAt < new Date()) {
      await this.otpModel.deleteMany({ email });
      throw new BadRequestException('expired_code');
    }

    const validOtp = await compare(otpVerification, otp);
    if (!validOtp) throw new BadRequestException('otp_is_incorrect');

    await this.otpModel.deleteMany({ email });
    return 'Success';
  }

  async recieveBooks(bookId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const book = await this.booksModel.findById(bookId);

    const emailData = {
      to: user.email,
      subject: 'Ordered book',
      from: 'togaevn14@gmail.com',
      html: `
				<a href="${book.pdf}">Your ordered book - ${book.title}</a>
			`,
    };

    try {
      await SendGrid.send(emailData);
      return 'Success';
    } catch (error) {
      // SendGrid xatolarni handle qilish
      if (error.response) {
        const { statusCode, body } = error.response;
        console.error('SendGrid Error:', { statusCode, body });
        
        if (statusCode === 401 || statusCode === 403) {
          throw new UnauthorizedException('Email xizmati sozlashda xatolik. Iltimos, administrator bilan bog\'laning.');
        }
        
        throw new BadRequestException(`Email yuborishda xatolik: ${body?.message || 'Noma'lum xatolik'}`);
      }
      
      throw new BadRequestException('Email yuborishda xatolik yuz berdi');
    }
  }
}
