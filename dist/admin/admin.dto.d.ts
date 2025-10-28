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
export declare class CreateUserDto {
    email: string;
    fullName: string;
    password: string;
    role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}
export declare class UpdateUserDto {
    userId: string;
    email?: string;
    fullName?: string;
    password?: string;
    role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}
export declare class DeleteUserDto {
    userId: string;
}
