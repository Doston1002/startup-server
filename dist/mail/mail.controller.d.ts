import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendOtp(dto: {
        email: string;
        isUser: boolean;
    }): Promise<string>;
    verifyOtp(dto: {
        email: string;
        otpVerification: string;
    }): Promise<string>;
    recieveBooks(bookId: string, _id: string): Promise<string>;
}
