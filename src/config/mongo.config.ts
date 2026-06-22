import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoDBConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri =
    configService.get<string>('MONGODB_URI')?.trim() ||
    process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI .env faylida topilmadi');
  }

  return { uri };
};
