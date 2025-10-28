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

export class CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}

export class UpdateUserDto {
  userId: string;
  email?: string;
  fullName?: string;
  password?: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'USER';
}

export class DeleteUserDto {
  userId: string;
}