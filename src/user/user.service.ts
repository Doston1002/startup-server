import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
// import { InjectStripe } from 'nestjs-stripe';
// import Stripe from 'stripe';
import { InterfaceEmailAndPassword, UpdateUserDto, ChangeRoleDto } from './user.interface';
import { User, UserDocument } from './user.model';
import { UserActivityLogger } from 'src/logger/user-activity.logger';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectStripe() private readonly stripeClient: Stripe,
    private readonly userActivityLogger: UserActivityLogger,
  ) {}

  async byId(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async editPassword(dto: InterfaceEmailAndPassword) {
    const { email, password } = dto;

    const existUser = await this.userModel.findOne({ email });
    if (!existUser) throw new UnauthorizedException('user_not_found');

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    await this.userModel.findByIdAndUpdate(
      existUser._id,
      { $set: { password: hashPassword } },
      { new: true },
    );

    // Parol o'zgartirish logi (talab bo'yicha yangi parolni yozamiz)
    this.userActivityLogger.logUserActivity({
      email: existUser.email,
      userId: existUser._id.toString(),
      fullName: existUser.fullName,
      role: existUser.role,
      method: 'PUT',
      url: '/api/user/edit-password',
      action: 'CHANGE_PASSWORD',
      message: `${existUser.fullName} parolini "${password}" ga o'zgartirdi`,
      statusCode: 200,
    });

    return 'Success';
  }

  async updateUser(body: UpdateUserDto, userID: string) {
    const { avatar, firstName, lastName, bio, birthday, job } = body;

    const user = await this.userModel.findByIdAndUpdate(
      userID,
      {
        $set: { fullName: `${firstName} ${lastName}`, avatar, bio, birthday, job },
      },
      { new: true },
    );

    return user;
  }

  async allTransactions(customerId: string) {
    // const transactions = await this.stripeClient.charges.list({
    //   customer: customerId,
    //   limit: 100,
    // });

    return {};
  }

  async myCourses(userId: string) {
    const user = await this.userModel.findById(userId).populate('courses').exec();

    return user.courses;
  }

  async changeRole(dto: ChangeRoleDto) {
    const { userId, role } = dto;

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true }
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }
}
