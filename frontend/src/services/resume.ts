const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ResumeDetail {
  filename: string;
  file_size: number;
  page_count: number;
  word_count: number;
  text: string;
}

export interface ResumeUploadResponse {
  resume: ResumeDetail;
}

export async function uploadResume(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ResumeUploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', `${API_BASE_URL}/api/v1/resume/upload`, true);

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as ResumeUploadResponse;
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse server response.'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.detail || `Upload failed: ${xhr.statusText}`));
        } catch {
          reject(new Error(`Upload failed with status code ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('A network error occurred. Please verify the backend service is running.'));
    };

    xhr.send(formData);
  });
}
