import { ENDPOINT } from "@/constants";
import {apiClient} from "@/lib";
import { UploadImagePayload, UploadResponse, UploadedFile, DeleteImagePayload, DeleteImageResponse } from "@/types";

/**
 * Upload image(s) to the server with progress tracking
 * Single function for all upload needs
 * 
 * @param payload - Upload payload containing image(s) and folder
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise with array of uploaded file data
 * 
 * @example
 * ```typescript
 * // Simple upload
 * const files = await uploadImage({ images: file, folders: UPLOAD_FOLDER.PRODUCTS });
 * const urls = files.map(item => item.url);
 * 
 * // With progress tracking
 * const [progress, setProgress] = useState(0);
 * const files = await uploadImage(
 *   { images: file, folders: UPLOAD_FOLDER.PRODUCTS },
 *   (progressPercent) => setProgress(progressPercent)
 * );
 * 
 * // Multiple files
 * const files = await uploadImage({ images: fileList, folders: UPLOAD_FOLDER.PRODUCTS });
 * ```
 */
export async function uploadImage(
    payload: UploadImagePayload,
    onProgress?: (progress: number) => void
): Promise<UploadedFile[]> {
    const formData = new FormData();
    
    if (payload.images instanceof FileList) {
        Array.from(payload.images).forEach((file) => {
            formData.append('images', file);
        });
    } else {
        formData.append('images', payload.images);
    }
    
    formData.append('folders', payload.folders);

    // Configure request for multipart/form-data
    // When using FormData, axios automatically sets Content-Type: multipart/form-data with boundary
    const config: any = {
        headers: {} as Record<string, string>,
        transformRequest: [(data: FormData) => data], 
    };
    
    
    // Add progress tracking
    if (onProgress) {
        config.onUploadProgress = (progressEvent: any) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percentCompleted);
            }
        };
    }
    
    const response = await apiClient.post<UploadResponse>(ENDPOINT.UPLOADS.MULTIPLE, formData, config);
    
    return response.data.data;
}

/**
 * Delete an image from the server
 * 
 * @param payload - Delete payload containing the image URL
 * @returns Promise with delete response message
 * 
 * @example
 * ```typescript
 * const result = await deleteImage({ url: 'https://res.cloudinary.com/...' });
 * console.log(result.message); // "Image deleted successfully"
 * ```
 */
export async function deleteImage(
    payload: DeleteImagePayload
): Promise<DeleteImageResponse> {
    const response = await apiClient.post<DeleteImageResponse>(
        ENDPOINT.UPLOADS.DELETE,
        { url: payload.url }
    );
    
    return response.data;
}
