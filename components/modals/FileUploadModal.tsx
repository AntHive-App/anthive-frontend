import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
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

  const convertImageToJPG = async (fileUri: string) => {
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

  const processFile = async () => {
    if (!selectedFile?.assets?.[0]) return;

    try {
      setUploading(true);

      const file = selectedFile.assets[0];
      let extractedText = '';

      const mimeType = file.mimeType || '';
      
      if (mimeType === 'application/pdf') {
        // Convert PDF to image and use Textract
        const imageUri = await convertImageToJPG(file.uri);
        extractedText = await api.extractText(imageUri, 'pdf');
      } else if (mimeType.startsWith('image/')) {
        // Convert image to JPG and use Textract
        const jpgUri = await convertImageToJPG(file.uri);
        extractedText = await api.extractText(jpgUri, 'image');
      } else {
        // For office documents, we'll need to implement a different text extraction method
        // For now, we'll just use the file name as content
        extractedText = `File: ${file.name}\n\nNote: Office document text extraction is not yet implemented.`;
      }

      // Send the extracted text to the API
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
      Alert.alert(
        'Error',
        'Failed to process the file. Please try again.',
        [{ text: 'OK' }]
      );
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
        <View className="bg-[#1F2937] rounded-lg p-6 w-11/12 max-w-md">
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
                  Supported formats: PDF, JPEG, PNG, HEIF, HEIC, Word, PowerPoint
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