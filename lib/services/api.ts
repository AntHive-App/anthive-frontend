import * as FileSystem from 'expo-file-system';

const API_BASE_URL = 'http://localhost:8001';

export const api = {
  async extractText(fileUri: string, fileType: 'image' | 'pdf') {
    try {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(`${API_BASE_URL}/extract-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          fileType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to extract text');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  },

  async processNote(params: {
    title: string;
    content: string;
    user_id: string;
    folder_id: string;
    source_type: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/process-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process note');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing note:', error);
      throw error;
    }
  },
}; 