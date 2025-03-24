import { optimizeImageForUpload, blobToFile } from '../utils/photo-utils.js';
import { supabase } from '../../../supabase.js';

/**
 * Service for handling photo/image uploads
 */
export class PhotoService {
    /**
     * Upload a photo to storage
     * @param {File} file - The file to upload
     * @param {string} folder - Storage folder
     * @returns {Promise<Object>} - Upload result
     */
    static async uploadPhoto(file, folder = 'payment_proofs') {
        try {
            if (!file) {
                throw new Error('No file selected');
            }
            
            const supabase = window.supabaseConfig.initSupabase();
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // Create a unique filename
            const timestamp = new Date().getTime();
            const filename = `${timestamp}-${file.name}`;
            const filePath = `${folder}/${filename}`;
            
            // Upload the file
            const { data, error } = await supabase.storage
                .from(folder)
                .upload(filePath, file);
                
            if (error) throw error;
            
            // Get the public URL
            const { data: urlData } = supabase.storage
                .from(folder)
                .getPublicUrl(filePath);
                
            return {
                success: true,
                path: filePath,
                url: urlData.publicUrl
            };
        } catch (error) {
            console.error('PhotoService upload error:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload photo'
            };
        }
    }
    
    /**
     * Get a photo URL from storage
     * @param {string} path - Storage path
     * @param {string} bucket - Storage bucket name
     * @returns {string} - Public URL of the photo
     */
    static getPhotoUrl(path, bucket = 'payment_proofs') {
        if (!path) return null;
        
        const supabase = window.supabaseConfig.initSupabase();
        if (!supabase) return null;
        
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data?.publicUrl || null;
    }
}

// Make service available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.PhotoService = PhotoService;
}
