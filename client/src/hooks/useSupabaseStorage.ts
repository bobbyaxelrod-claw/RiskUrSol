import { useState } from "react";
import {
  deleteFile,
  getPublicUrl,
  supabase,
  uploadFile,
} from "@/lib/supabase";

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error?: string;
}

export function useSupabaseStorage() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
  });

  const upload = async (
    bucket: string,
    path: string,
    file: File | Blob
  ): Promise<string | null> => {
    try {
      setUploadProgress({ isUploading: true, progress: 0 });

      // Upload file
      await uploadFile(bucket, path, file);

      // Get public URL
      const publicUrl = getPublicUrl(bucket, path);

      setUploadProgress({ isUploading: false, progress: 100 });
      return publicUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      });
      return null;
    }
  };

  const remove = async (bucket: string, path: string): Promise<boolean> => {
    try {
      await deleteFile(bucket, path);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  };

  const getUrl = (bucket: string, path: string): string => {
    return getPublicUrl(bucket, path);
  };

  return {
    upload,
    remove,
    getUrl,
    uploadProgress,
  };
}
