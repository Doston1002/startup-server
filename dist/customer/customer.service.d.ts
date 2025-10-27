import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.model';
export declare class CustomerService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createCustomer(userID: string): Promise<{}>;
    getCustomer(userID: string): Promise<{}>;
    atachPaymentMethod(paymentMethod: string, userID: string): Promise<{}>;
    savedCustomerCard(customerId: string): Promise<{}>;
}
