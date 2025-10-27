export declare class ApproveInstructorDto {
    instructorId: string;
}
export declare class DeleteCourseDto {
    courseId: string;
}
export declare class UpdateUserRoleDto {
    userId: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}
