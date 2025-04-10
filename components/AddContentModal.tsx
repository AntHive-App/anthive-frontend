import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddContentModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: 'text' | 'audio' | 'file' | 'youtube') => void;
}

export default function AddContentModal({ visible, onClose, onSelectType }: AddContentModalProps) {
  const options = [
    { type: 'text', icon: 'document-text', label: 'Text Note' },
    { type: 'audio', icon: 'mic', label: 'Audio Recording' },
    { type: 'file', icon: 'document', label: 'File Upload' },
    { type: 'youtube', icon: 'logo-youtube', label: 'YouTube Link' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-gray-800 rounded-lg p-4 w-11/12 max-w-sm">
          <Text className="text-xl font-bold text-white mb-4">Add Content</Text>
          
          <View className="space-y-2">
            {options.map((option) => (
              <TouchableOpacity
                key={option.type}
                onPress={() => onSelectType(option.type as any)}
                className="flex-row items-center bg-gray-700 p-3 rounded-lg"
              >
                <Ionicons name={option.icon as any} size={24} color="white" />
                <Text className="text-white ml-3">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-gray-700 p-3 rounded-lg"
          >
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 