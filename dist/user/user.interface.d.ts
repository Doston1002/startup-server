import { UserDocument } from './user.model';
export type RoleUser = 'ADMIN' | 'INSTRUCTOR' | 'USER';
export type UserTypeData = keyof UserDocument;
export declare class InterfaceEmailAndPassword {
    email: string;
    password: string;
}
export declare class UpdateUserDto {
    firstName: string;
    lastName: string;
    birthday: string;
    job: string;
    bio: string;
    avatar: string;
}
export declare class ChangeRoleDto {
    userId: string;
    role: RoleUser;
}
