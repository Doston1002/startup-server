export declare class CreateContactDto {
    fullName: string;
    phone?: string;
    message?: string;
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
