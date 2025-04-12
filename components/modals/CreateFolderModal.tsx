import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import Button from '../Button';
import { useRouter } from 'expo-router';

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

export default function CreateFolderModal({ visible, onClose, userId }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const checkFolderNameAvailability = async (folderName: string) => {
    const { data, error } = await supabase
      .from('folders')
      .select('name')
      .eq('name', folderName.trim())
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking folder name:', error);
      return false;
    }

    return !data; // If data exists, name is taken
  };

  const handleCreateFolder = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter a folder name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if folder name is available
      const isAvailable = await checkFolderNameAvailability(name);
      if (!isAvailable) {
        setError('A folder with this name already exists');
        setLoading(false);
        return;
      }

      // Create the folder
      const { data, error } = await supabase
        .from('folders')
        .insert([
          {
            user_id: userId,
            name: name.trim(),
            description: description.trim(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Navigate to the new folder
      router.push(`/folder/${data.name}` as any);
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder. Please try again.');
    } finally {
      setLoading(false);
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
        <View className="bg-white rounded-lg p-4 w-11/12 max-w-sm -mt-20">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Create New Folder</Text>
          <Text className="text-gray-600 mb-4">
            Enter the details for your new folder
          </Text>

          <View className="mb-4">
            <Text className="text-gray-600 text-xs font-bold mb-1">FOLDER NAME</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
              placeholder="Enter folder name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-xs font-bold mb-1">DESCRIPTION</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
              placeholder="Enter folder description (optional)"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {error ? (
            <Text className="text-red-500 text-xs mb-4">{error}</Text>
          ) : null}

          <View className="flex-row justify-end space-x-4">
            <View className="w-28">
              <Button
                variant="outline"
                label="Cancel"
                onPress={onClose}
                disabled={loading}
              />
            </View>
            <View className="w-28">
              <Button
                label={loading ? 'Creating...' : 'Create'}
                onPress={handleCreateFolder}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
