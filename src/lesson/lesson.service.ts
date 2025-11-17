import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sanitizeHtml, sanitizeText } from 'src/helpers/sanitize.helper';
import { Section } from 'src/section/section.model';
import { LessonDto } from './lesson.dto';
import { Lesson } from './lesson.model';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async createLesson(body: LessonDto, sectionId: string) {
    // ✅ SECURITY FIX: XSS/HTML Injection himoyasi - material va name fieldlarini sanitize qilish
    const sanitizedBody = {
      ...body,
      material: sanitizeHtml(body.material),
      name: sanitizeText(body.name), // Name faqat text bo'lishi kerak
      embedVideo: sanitizeHtml(body.embedVideo), // Embed video HTML bo'lishi mumkin, lekin sanitize qilamiz
    };
    
    const lesson = await this.lessonModel.create(sanitizedBody);
    const section = await this.sectionModel
      .findByIdAndUpdate(
        sectionId,
        {
          $push: { lessons: lesson._id },
        },
        { new: true },
      )
      .populate('lessons');

    return section;
  }

  async editLesson(body: LessonDto, lessonId: string) {
    // ✅ SECURITY FIX: XSS/HTML Injection himoyasi - material va name fieldlarini sanitize qilish
    const sanitizedBody = {
      ...body,
      material: sanitizeHtml(body.material),
      name: sanitizeText(body.name), // Name faqat text bo'lishi kerak
      embedVideo: sanitizeHtml(body.embedVideo), // Embed video HTML bo'lishi mumkin, lekin sanitize qilamiz
    };
    
    const lesson = await this.lessonModel.findByIdAndUpdate(lessonId, sanitizedBody, { new: true });

    return lesson;
  }

  async deleteLesson(sectionId: string, lessonId: string) {
    await this.lessonModel.findByIdAndRemove(lessonId);
    const section = this.sectionModel
      .findByIdAndUpdate(sectionId, { $pull: { lessons: lessonId } }, { new: true })
      .populate('lessons');

    return section;
  }

  async getLesson(sectionId: string) {
    const section = await this.sectionModel.findById(sectionId).populate('lessons');

    return section.lessons;
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      lessonId,
      { $push: { completed: userId } },
      { new: true },
    );

    return lesson;
  }

  async uncompleteLesson(userId: string, lessonId: string) {
    const lesson = await this.lessonModel.findByIdAndUpdate(
      lessonId,
      { $pull: { completed: userId } },
      { new: true },
    );

    return lesson;
  }
}
