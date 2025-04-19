import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import * as mammoth from 'mammoth';
import { api } from '@/lib/services/api';

interface FileUploadModalProps {
  visible: boolean;
  onClose: () => void;
  folderId: string;
  userId: string;
  onUploadComplete: () => void;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heif',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export default function FileUploadModal({ visible, onClose, folderId, userId, onUploadComplete }: FileUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_FILE_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (!ALLOWED_FILE_TYPES.includes(file.mimeType || '')) {
          Alert.alert(
            'Invalid File Type',
            'Please select a PDF, image, Word, or PowerPoint file.',
            [{ text: 'OK' }]
          );
          return;
        }
        setSelectedFile(result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Error',
        'Failed to select file. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const convertFileToJPG = async (fileUri: string) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        fileUri,
        [],
        {
          format: ImageManipulator.SaveFormat.JPEG,
          compress: 0.8,
        }
      );
      return result.uri;
    } catch (error) {
      console.error('Error converting image:', error);
      throw error;
    }
  };

  const extractWordText = async (fileUri: string): Promise<string> => {
    try {
      const response = await fetch(fileUri);
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      console.log('Extracted Word text:', result.value);
      return result.value;
    } catch (error) {
      console.error('Error extracting Word text:', error);
      throw new Error('Failed to extract text from Word document');
    }
  };


  const processFile = async () => {
    if (!selectedFile?.assets?.[0]) return;

    try {
      setUploading(true);
      setError(null);

      const file = selectedFile.assets[0];
      const mimeType = file.mimeType || '';
      let extractedText = '';

      if (mimeType === 'application/pdf') {
        // Convert file to blob
        const response = await fetch(file.uri);
        const blob = await response.blob();
        
        // Create form data with the required payload
        const formData = new FormData();
        formData.append('content', blob);
        formData.append('user_id', userId);
        formData.append('folder_id', folderId);
        formData.append('source_type', 'file');
        
        // Send to PDF processing API
        const pdfResponse = await fetch('http://localhost:8001/process-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!pdfResponse.ok) {
          throw new Error('Failed to process PDF file');
        }

        // Close modal after successful upload
        onUploadComplete();
        onClose();
        return;
      } else if (mimeType === 'application/vnd.ms-powerpoint' || 
                 mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        // Convert file to blob
        const response = await fetch(file.uri);
        const blob = await response.blob();
        
        // Create form data with the required payload
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('user_id', userId);
        formData.append('folder_id', folderId);
        formData.append('source_type', 'file');
        
        // Send to PowerPoint processing API
        const pptResponse = await fetch('http://localhost:8001/process-ppt', {
          method: 'POST',
          body: formData,
        });

        if (!pptResponse.ok) {
          throw new Error('Failed to process PowerPoint file');
        }

        // Close modal after successful upload
        onUploadComplete();
        onClose();
        return;
      } else if (mimeType.startsWith('image/')) {
        // Convert image to JPG and use Textract
        const jpgUri = await convertFileToJPG(file.uri);
        extractedText = await api.extractText(jpgUri, 'image');
      } else if (mimeType === 'application/msword' || 
                 mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Extract text from Word document
        extractedText = await extractWordText(file.uri);
      } else {
        setError('Unsupported file type');
        return;
      }

      // Send the extracted text to the API (only for non-PDF and non-PPT files)
      await api.processNote({
        title: file.name,
        content: extractedText,
        user_id: userId,
        folder_id: folderId,
        source_type: 'file'
      });

      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process the file. Please try again.');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#1F2937] rounded-lg p-6 w-11/12 max-w-md -mt-20">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-white text-xl font-bold">Upload File</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {!selectedFile?.assets?.[0] ? (
              <TouchableOpacity
                className="bg-[#374151] rounded-lg p-4 items-center"
                onPress={pickDocument}
              >
                <Ionicons name="cloud-upload-outline" size={32} color="#FFFFFF" />
                <Text className="text-white mt-2">Select File</Text>
                <Text className="text-gray-400 text-center text-sm mt-2">
                  Supported formats: PDF, Word, PowerPoint
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="space-y-4">
                <View className="bg-[#374151] rounded-lg p-4">
                  <Text className="text-white text-center">{selectedFile.assets[0].name}</Text>
                </View>

                {uploading && (
                  <View className="space-y-2">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-white text-center">Processing file...</Text>
                  </View>
                )}

                <TouchableOpacity
                  className="bg-sky-500 rounded-lg p-4 items-center"
                  onPress={processFile}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold">Process</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
} 