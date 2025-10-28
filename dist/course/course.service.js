"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const instructor_model_1 = require("../instructor/instructor.model");
const review_model_1 = require("../review/review.model");
const user_model_1 = require("../user/user.model");
const course_model_1 = require("./course.model");
let CourseService = class CourseService {
    constructor(courseModel, instructorModel, userModel, reviewModel) {
        this.courseModel = courseModel;
        this.instructorModel = instructorModel;
        this.userModel = userModel;
        this.reviewModel = reviewModel;
    }
    async createCourse(dto, id) {
        const slugify = (str) => str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const slug = slugify(dto.title);
        const course = await this.courseModel.create(Object.assign(Object.assign({}, dto), { slug: slug, author: id }));
        await this.instructorModel.findOneAndUpdate({ author: id }, { $push: { courses: course._id } }, { new: true });
        return 'Success';
    }
    async editCourse(dto, courseId, instructorId) {
        const course = await this.courseModel.findById(courseId);
        if (!course) {
            throw new common_1.UnauthorizedException('course_not_found');
        }
        if (course.author.toString() !== instructorId.toString()) {
            throw new common_1.UnauthorizedException('not_course_owner');
        }
        return await this.courseModel.findByIdAndUpdate(courseId, dto, { new: true });
    }
    async deleteCourse(courseId, userId) {
        await this.courseModel.findByIdAndRemove(courseId);
        await this.instructorModel.findOneAndUpdate({ author: userId }, { $pull: { courses: courseId } }, { new: true });
        return 'Success';
    }
    async activateCourse(courseId) {
        const course = await this.courseModel.findByIdAndUpdate(courseId, { $set: { isActive: true } }, { new: true });
        return course;
    }
    async draftCourse(courseId) {
        const course = await this.courseModel.findByIdAndUpdate(courseId, { $set: { isActive: false } }, { new: true });
        return course;
    }
    async dragCourseSections(courseId, sections) {
        const course = await this.courseModel
            .findByIdAndUpdate(courseId, { $set: { sections } }, { new: true })
            .populate({ path: 'sections', populate: { path: 'lessons' } });
        return course.sections;
    }
    async getCourses(language, limit) {
        const courses = (await this.courseModel
            .aggregate([
            {
                $match: { language },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $lookup: {
                    from: 'sections',
                    localField: 'sections',
                    foreignField: '_id',
                    as: 'sections',
                },
            },
            {
                $lookup: {
                    from: 'lessons',
                    localField: 'sections.lessons',
                    foreignField: '_id',
                    as: 'lessons',
                },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    reviewCount: { $size: '$reviews' },
                    reviewAvg: { $avg: '$reviews.rating' },
                },
            },
            {
                $unwind: '$author',
            },
            {
                $project: {
                    _id: 1,
                    author: 1,
                    sections: {
                        $map: {
                            input: '$sections',
                            as: 'section',
                            in: {
                                _id: '$$section._id',
                                title: '$$section.title',
                                lessons: {
                                    $map: {
                                        input: '$lessons',
                                        as: 'lesson',
                                        in: {
                                            _id: '$$lesson._id',
                                            name: '$$lesson.name',
                                            minute: '$$lesson.minute',
                                            second: '$$lesson.second',
                                            hour: '$$lesson.hour',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    slug: 1,
                    isActive: 1,
                    learn: 1,
                    requirements: 1,
                    tags: 1,
                    description: 1,
                    level: 1,
                    category: 1,
                    previewImage: 1,
                    title: 1,
                    exerpt: 1,
                    language: 1,
                    updatedAt: 1,
                    reviewCount: 1,
                    reviewAvg: 1,
                },
            },
        ])
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .exec());
        return courses.map(course => this.getSpecificFieldCourse(course));
    }
    async getDetailedCourse(slug) {
        const course = (await this.courseModel
            .findOne({ slug })
            .populate({ path: 'sections', populate: { path: 'lessons' } })
            .populate('author')
            .exec());
        const reviews = await this.reviewModel.find({ course: course._id });
        const avarage = this.getReviewAvarage(reviews.map(c => c.rating));
        const allStudents = await this.userModel.find({ courses: course._id });
        return Object.assign(Object.assign({}, this.getSpecificFieldCourse(course)), { reviewCount: reviews.length, reviewAvg: avarage, allStudents: allStudents.length });
    }
    getReviewAvarage(ratingArr) {
        let rating;
        if (ratingArr.length == 1) {
            rating = ratingArr[0];
        }
        if (ratingArr.length == 0) {
            rating = 5;
        }
        if (ratingArr.length > 1) {
            rating = (ratingArr.reduce((prev, next) => prev + next) * 5) / (ratingArr.length * 5);
        }
        return rating;
    }
    getSpecificFieldCourse(course) {
        return {
            title: course.title,
            previewImage: course.previewImage,
            level: course.level,
            category: course.category,
            _id: course._id,
            author: {
                fullName: course.author.fullName,
                avatar: course.author.avatar,
                job: course.author.job,
            },
            lessonCount: course.sections.map(c => c.lessons.length).reduce((a, b) => +a + +b, 0),
            totalHour: this.getTotalHours(course),
            updatedAt: course.updatedAt,
            learn: course.learn,
            requirements: course.requirements,
            description: course.description,
            language: course.language,
            exerpt: course.exerpt,
            slug: course.slug,
            reviewCount: course.reviewCount,
            reviewAvg: course.reviewAvg,
        };
    }
    getTotalHours(course) {
        let totalHour = 0;
        for (let s = 0; s < course.sections.length; s++) {
            const section = course.sections[s];
            let sectionHour = 0;
            for (let l = 0; l < section.lessons.length; l++) {
                const lesson = section.lessons[l];
                const hours = parseInt(String(lesson.hour));
                const seconds = parseInt(String(lesson.second));
                const minutes = parseInt(String(lesson.minute));
                const totalMinutes = hours * 60 + minutes;
                const totalSeconds = totalMinutes * 60 + seconds;
                const totalHourLesson = totalSeconds / 3600;
                sectionHour += totalHourLesson;
            }
            totalHour += sectionHour;
        }
        return totalHour.toFixed(1);
    }
    async getAdminCourses() {
        return this.courseModel.find().exec();
    }
    async enrollUser(userID, courseId) {
        await this.userModel.findByIdAndUpdate(userID, { $push: { courses: courseId } }, { new: true });
        return 'Success';
    }
};
CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_model_1.Course.name)),
    __param(1, (0, mongoose_1.InjectModel)(instructor_model_1.Instructor.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(review_model_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CourseService);
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map