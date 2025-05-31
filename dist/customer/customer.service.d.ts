import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.model';
import Stripe from 'stripe';
export declare class CustomerService {
    private userModel;
    private readonly stripeClient;
    constructor(userModel: Model<UserDocument>, stripeClient: Stripe);
    createCustomer(userID: string): Promise<Stripe.Response<Stripe.Customer>>;
    getCustomer(userID: string): Promise<Stripe.Response<Stripe.Customer> | (Stripe.DeletedCustomer & {
        lastResponse: {
            headers: {
                [key: string]: string;
            };
            requestId: string;
            statusCode: number;
            apiVersion?: string;
            idempotencyKey?: string;
            stripeAccount?: string;
        };
    })>;
    atachPaymentMethod(paymentMethod: string, userID: string): Promise<Stripe.Response<Stripe.PaymentMethod>>;
    savedCustomerCard(customerId: string): Promise<Stripe.PaymentMethod[]>;
}
