import { IsOptional, IsString } from 'class-validator';
import { LoginAuthDto } from './login.dto';

export class LoginWithCaptchaDto extends LoginAuthDto {
  @IsOptional()
  @IsString()
  captchaToken?: string;
}


