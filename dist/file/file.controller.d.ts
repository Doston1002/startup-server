/// <reference types="multer" />
import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    saveFile(file: Express.Multer.File, folder?: string): Promise<import("./file.interface").FileResponse>;
}
