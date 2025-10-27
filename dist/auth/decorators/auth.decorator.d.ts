import { RoleUser } from 'src/user/user.interface';
export declare const Auth: (role?: RoleUser) => <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
