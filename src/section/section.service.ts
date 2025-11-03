import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/course/course.model';
import { SectionDto } from './section.dto';
import { Section } from './section.model';
import { Lesson } from 'src/lesson/lesson.model';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async createSection({ title, initialLesson }: SectionDto, courseId: string) {
    const section = await this.sectionModel.create({ title });

    // Agar birlamchi dars berilgan bo'lsa, uni yaratib bo'limga qo'shamiz
    if (initialLesson) {
      const lesson = await this.lessonModel.create({
        name: initialLesson.name,
        material: initialLesson.material || '',
        embedVideo: initialLesson.embedVideo,
        hour: initialLesson.hour,
        minute: initialLesson.minute,
        second: initialLesson.second,
      });
      await this.sectionModel.findByIdAndUpdate(section._id, { $push: { lessons: lesson._id } });
    }
    const course = await this.courseModel
      .findByIdAndUpdate(
        courseId,
        {
          $push: { sections: section._id },
        },
        { new: true },
      )
      .populate({ path: 'sections', populate: { path: 'lessons' } });

    return course.sections;
  }

  async deleteSection(sectionId: string, courseId: string) {
    // Avval bo'limning barcha darslarini o'chiramiz
    const section = await this.sectionModel.findById(sectionId).populate('lessons');
    if (section && Array.isArray((section as any).lessons) && (section as any).lessons.length) {
      const lessonIds = ((section as any).lessons as any[]).map(l => l._id);
      await this.lessonModel.deleteMany({ _id: { $in: lessonIds } });
    }

    await this.sectionModel.findByIdAndRemove(sectionId);

    const course = await this.courseModel
      .findByIdAndUpdate(
        courseId,
        {
          $pull: { sections: sectionId },
        },
        { new: true },
      )
      .populate({ path: 'sections', populate: { path: 'lessons' } });

    return course.sections;
  }

  async editSection(sectionId: string, { title, lessons }: SectionDto) {
    return await this.sectionModel
      .findByIdAndUpdate(sectionId, { $set: { title, lessons } }, { new: true })
      .populate('lessons');
  }

  async getSection(courseId: string) {
    const course = await this.courseModel
      .findById(courseId)
      .populate({ path: 'sections', populate: { path: 'lessons' } });

    return course.sections;
  }
}
