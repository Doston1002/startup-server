import { IsString, IsNotEmpty } from 'class-validator';

export class OneIdLogoutDto {
  @IsString({ message: 'Access token talab qilinadi va string bo\'lishi kerak' })
  @IsNotEmpty({ message: 'Access token bo\'sh bo\'lmasligi kerak' })
  access_token: string;
}

