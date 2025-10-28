import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { UserDocument } from './user.model';

export type RoleUser = 'ADMIN' | 'INSTRUCTOR' | 'USER';
export type UserTypeData = keyof UserDocument;

// ✅ SECURITY FIX: Interface ni Class DTO ga o'zgartirdik validation uchun
export class InterfaceEmailAndPassword {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // ✅ SECURITY FIX: Xavfsiz parol talablari
  @IsString()
  @IsNotEmpty({ message: 'Parol bo\'sh bo\'lmasligi kerak' })
  @MinLength(8, { message: 'Parol kamida 8 belgidan iborat bo\'lishi kerak' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Parol kamida 1 harf va 1 raqamdan iborat bo\'lishi kerak. Masalan: mypass123',
  })
  password: string;
}

export class UpdateUserDto {
  firstName: string;
  lastName: string;
  birthday: string;
  job: string;
  bio: string;
  avatar: string;
}

export class ChangeRoleDto {
  userId: string;
  role: RoleUser;
}