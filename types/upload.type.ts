// ==============================
// Upload Folder Enum
// ==============================
export enum UPLOAD_FOLDER {
    PRODUCTS = 'products',
    CATEGORIES = 'categories',
}

// ==============================
// Upload Response Types
// ==============================
export interface UploadedFile {
    url: string;
    public_id: string;
}

export interface UploadResponse {
    success: boolean;
    data: UploadedFile[];
}

// ==============================
// Upload Payload Types
// ==============================
export interface UploadImagePayload {
    images: File | FileList;
    folders: UPLOAD_FOLDER;
}

export interface DeleteImagePayload {
    url: string;
}

export interface DeleteImageResponse {
    status: number;
    message: string;
}

