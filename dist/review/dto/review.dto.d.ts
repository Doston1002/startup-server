export declare class CreateReviewDto {
    course: string;
    author: string;
    rating: number;
    summary: string;
}
export declare class EditReviewDto {
    summary: string;
    rating: number;
}
export declare class GetByUserDto {
    course: string;
    user: string;
}
