import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { supabase } from '../lib/supabase';

interface AddContentModalProps {
  visible: boolean;
  onClose: () => void;
  folderName: string;
  userId: string;
}

export default function AddContentModal({ visible, onClose, folderName, userId }: AddContentModalProps) {
  const [link, setLink] = useState('');
  const [linkType, setLinkType] = useState<'youtube' | 'drive'>('youtube');
  const [isRecording, setIsRecording] = useState(false);

  const handleTextUpload = async () => {
    // TODO: Implement text upload logic
  };

  const handleFileUpload = async () => {
    // TODO: Implement PDF upload logic
  };

  const handleLinkUpload = async () => {
    if (!link.trim()) return;
    
    try {
      const { error } = await supabase
        .from('resources')
        .insert([
          {
            folder_name: folderName,
            type: 'link',
            content: link,
            link_type: linkType,
            user_id: userId,
          }
        ]);

      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error uploading link:', error);
    }
  };

  const handleAudioUpload = async () => {
    // TODO: Implement audio upload logic
  };

  const startRecording = async () => {
    // TODO: Implement audio recording logic
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // TODO: Implement stop recording logic
    setIsRecording(false);
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
            <Text className="text-white text-xl font-bold">Add Content to {folderName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[80vh]">
            {/* Text/PDF Upload Section */}
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-4">Upload Text or File</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  className="flex-1 bg-[#374151] rounded-lg p-4 items-center"
                  onPress={handleTextUpload}
                >
                  <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
                  <Text className="text-white mt-2">Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-[#374151] rounded-lg p-4 items-center"
                  onPress={handleFileUpload}
                >
                  <Ionicons name="document-outline" size={32} color="#FFFFFF" />
                  <Text className="text-white mt-2">PDF</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Link Upload Section */}
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-4">Add Link</Text>
              <View className="flex-row space-x-2 mb-4">
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg ${
                    linkType === 'youtube' ? 'bg-blue-500' : 'bg-[#374151]'
                  }`}
                  onPress={() => setLinkType('youtube')}
                >
                  <Text className="text-white text-center">YouTube</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg ${
                    linkType === 'drive' ? 'bg-blue-500' : 'bg-[#374151]'
                  }`}
                  onPress={() => setLinkType('drive')}
                >
                  <Text className="text-white text-center">Google Drive</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="bg-[#374151] rounded-lg p-4 text-white mb-4"
                placeholder="Paste your link here"
                placeholderTextColor="#9CA3AF"
                value={link}
                onChangeText={setLink}
              />
              
              <Button
                label="Add Link"
                onPress={handleLinkUpload}
                variant="primary"
              />
            </View>

            {/* Audio Section */}
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-4">Audio</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity
                  className="flex-1 bg-[#374151] rounded-lg p-4 items-center"
                  onPress={handleAudioUpload}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color="#FFFFFF" />
                  <Text className="text-white mt-2">Upload Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 bg-[#374151] rounded-lg p-4 items-center ${
                    isRecording ? 'bg-red-500' : ''
                  }`}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Ionicons
                    name={isRecording ? 'stop-circle-outline' : 'mic-outline'}
                    size={32}
                    color="#FFFFFF"
                  />
                  <Text className="text-white mt-2">
                    {isRecording ? 'Stop Recording' : 'Record Audio'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
} 