import { useState } from "react";
import { supabase } from "../lib/supabase";

export interface ExtractedIdData {
  // ID Card Information
  idType: string;
  idNumber: string;
  issueDate?: string;
  expiryDate?: string;

  // Personal Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  gender?: string;

  // Address Information
  address?: string;
  city?: string;
  province?: string;
  country?: string;

  // Additional Fields
  photo?: string;
  rawData?: any;
}

interface UseIdExtractionResult {
  uploadAndExtract: (file: File, idType: string) => Promise<ExtractedIdData>;
  isUploading: boolean;
  isExtracting: boolean;
  uploadProgress: number;
  error: string | null;
  extractedData: ExtractedIdData | null;
}

export const useIdExtraction = (): UseIdExtractionResult => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedIdData | null>(
    null
  );

  const uploadAndExtract = async (
    file: File,
    idType: string
  ): Promise<ExtractedIdData> => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Starting upload for user:", user.id);

      // Create file path: userId/idType/filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${idType}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("ids")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("File uploaded successfully:", uploadData.path);
      setUploadProgress(50);
      setIsUploading(false);
      setIsExtracting(true);

      // Create a presigned URL for the uploaded file (valid for 1 hour)
      const { data: urlData, error: urlError } = await supabase.storage
        .from("ids")
        .createSignedUrl(uploadData.path, 3600);

      if (urlError || !urlData) {
        console.error("Error creating signed URL:", urlError);
        throw new Error("Failed to create signed URL for uploaded file");
      }

      console.log("Presigned URL created, calling extraction function...");
      setUploadProgress(60);

      // Get the Supabase function URL
      const functionUrl = `${
        process.env.REACT_APP_SUPABASE_URL
      }/functions/v1/extract-id-data`;

      // Call the edge function to extract data
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: urlData.signedUrl,
          idType,
          userId: user.id,
        }),
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Extraction failed");
      }

      const result = await response.json();
      console.log("Extraction result:", result);

      if (!result.success) {
        throw new Error(result.error || "Extraction failed");
      }

      setUploadProgress(100);
      setExtractedData(result.data);
      setIsExtracting(false);

      return result.data;
    } catch (err) {
      console.error("Error in uploadAndExtract:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setIsUploading(false);
      setIsExtracting(false);
      throw err;
    }
  };

  return {
    uploadAndExtract,
    isUploading,
    isExtracting,
    uploadProgress,
    error,
    extractedData,
  };
};

