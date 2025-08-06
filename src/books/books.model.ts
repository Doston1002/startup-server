import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BooksDocument = HydratedDocument<Books>;

@Schema({ timestamps: true })
export class Books {
  @Prop()
  title: string;

  @Prop()
  pdf: string; // PDF fayl manzili

  @Prop()
  category: string; // sinf yoki turkum
}

export const BooksSchema = SchemaFactory.createForClass(Books);