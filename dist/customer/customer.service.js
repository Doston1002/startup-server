"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nestjs_stripe_1 = require("nestjs-stripe");
const user_model_1 = require("../user/user.model");
const stripe_1 = require("stripe");
let CustomerService = class CustomerService {
    constructor(userModel, stripeClient) {
        this.userModel = userModel;
        this.stripeClient = stripeClient;
    }
    async createCustomer(userID) {
        const user = await this.userModel.findById(userID);
        const { email } = user;
        const customer = await this.stripeClient.customers.create({
            email: email,
            metadata: {
                customerUID: userID,
            },
        });
        const updateUser = await this.userModel.findByIdAndUpdate(user._id, { $set: { customerId: customer.id } }, { new: true });
        updateUser.save();
        return customer;
    }
    async getCustomer(userID) {
        const user = await this.userModel.findById(userID);
        const { customerId } = user;
        if (!customerId) {
            return this.createCustomer(userID);
        }
        const customer = await this.stripeClient.customers.retrieve(customerId);
        return customer;
    }
    async atachPaymentMethod(paymentMethod, userID) {
        const customer = await this.getCustomer(userID);
        const atachedCard = await this.stripeClient.paymentMethods.attach(paymentMethod, {
            customer: customer.id,
        });
        return atachedCard;
    }
    async savedCustomerCard(customerId) {
        if (!customerId)
            throw new common_1.UnauthorizedException();
        const cards = await this.stripeClient.paymentMethods.list({
            customer: customerId,
            limit: 3,
            type: 'card',
        });
        return cards.data;
    }
};
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, nestjs_stripe_1.InjectStripe)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        stripe_1.default])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map