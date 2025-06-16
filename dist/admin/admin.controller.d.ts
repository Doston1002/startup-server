import { ApproveInstructorDto } from './admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllInstructors(): Promise<{
        approved: boolean;
        socialMedia: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            email: string;
            job: string;
        };
    }[]>;
    aproveInstructor(body: ApproveInstructorDto): Promise<string>;
    deleteInstructor(body: ApproveInstructorDto): Promise<string>;
    getAllUsers(limit: string): Promise<{
        email: string;
        fullName: string;
        _id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    searchUser(email: string, limit: string): Promise<{
        email: string;
        fullName: string;
        _id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    deleteCourse(courseId: string): Promise<{
        title: string;
        previewImage: string;
        isActive: boolean;
        language: string;
        _id: import("mongoose").Types.ObjectId;
    }[]>;
}
