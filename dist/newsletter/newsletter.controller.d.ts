import { NewsletterService } from './newsletter.service';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        email: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        email?: undefined;
    }>;
    getAllSubscribers(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("./newsletter.model").Newsletter> & Omit<import("./newsletter.model").Newsletter & {
            _id: import("mongoose").Types.ObjectId;
        }, never>)[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
}
