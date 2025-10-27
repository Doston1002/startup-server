import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { BooksDocument } from 'src/books/books.model';
import { UserDocument } from 'src/user/user.model';
import { OtpDocument } from './otp.model';
export declare class MailService {
    private otpModel;
    private userModel;
    private booksModel;
    private readonly configService;
    constructor(otpModel: Model<OtpDocument>, userModel: Model<UserDocument>, booksModel: Model<BooksDocument>, configService: ConfigService);
    sendOtpVerification(email: string, isUser: boolean): Promise<string>;
    verifyOtp(email: string, otpVerification: string): Promise<string>;
    recieveBooks(bookId: string, userId: string): Promise<string>;
}
