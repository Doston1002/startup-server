export class CreateContactDto {
  fullName: string;
  phone?: string;
  message?: string;
  
  // Attendance specific fields
  teacherName?: string;
  region?: string;
  district?: string;
  school?: string;
  schoolClass?: string;
  subject?: string;
  teachingMethod?: string;
  isAbsent?: boolean;
  type?: 'contact' | 'attendance';
}
