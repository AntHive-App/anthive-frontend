import React from 'react';
import { Modal, View, Text } from 'react-native';
import Button from './Button';
import { supabase } from '../lib/supabase';

interface DeleteFolderModalProps {
  visible: boolean;
  onClose: () => void;
  folderId: string;
  onDelete: () => void;
}

export default function DeleteFolderModal({ visible, onClose, folderId, onDelete }: DeleteFolderModalProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting folder:', error);
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
        <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Delete Folder</Text>
          <Text className="text-gray-600 mb-6">
            Are you sure you want to delete this folder? This action cannot be undone.
          </Text>

          <View className="flex-row justify-end space-x-4">
            <View className="w-28">
              <Button
                variant="outline"
                label="Cancel"
                onPress={onClose}
              />
            </View>
            <View className="w-28">
              <Button
                label="Delete"
                onPress={handleDelete}
                variant="danger"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
} 