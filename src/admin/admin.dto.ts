export class ApproveInstructorDto {
  instructorId: string;
}

export class DeleteCourseDto {
  courseId: string;
}

export class UpdateUserRoleDto {
  userId: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}
