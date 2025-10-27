/// <reference types="multer" />
import { FileResponse } from './file.interface';
export declare class FileService {
    saveFile(file: Express.Multer.File, folder?: string): Promise<FileResponse>;
}
