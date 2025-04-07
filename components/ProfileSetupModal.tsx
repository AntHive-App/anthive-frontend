import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Button from './Button';

interface ProfileSetupModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

// TODO: error handling for username length and special characters use set error to indicate errors

export default function ProfileSetupModal({ visible, onClose, userId }: ProfileSetupModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const checkUsernameAvailability = async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.trim())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error
      console.error('Error checking username:', error);
      return false;
    }

    return !data; // If data exists, username is taken
  };

  const handleCreateProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Check username availability
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        setUsernameError('Username already exists');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username.trim(),
          updated_at: new Date(),
        });

      if (error) throw error;
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (text: string) => {
    setUsername(text);
    
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
          <Text className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</Text>
          <Text className="text-gray-600 mb-4">
            Add your details to get started
          </Text>

          <View className="mb-4">
            <Text className="text-gray-600 text-xs font-bold mb-1">FIRST NAME</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
              placeholder="First name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-xs font-bold mb-1">LAST NAME</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
              placeholder="Last name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-xs font-bold mb-1">USERNAME</Text>
            <TextInput
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
              placeholder="Choose a username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={username}
              onChangeText={handleUsernameChange}
            />
            {usernameError ? (
              <Text className="text-red-500 text-xs mt-1">{usernameError}</Text>
            ) : null}
          </View>

          <View className="flex-row justify-end space-x-2">
            <View className="w-32">
              <Button
                label={loading ? 'Creating...' : 'Create'}
                onPress={handleCreateProfile}
                variant="primary"
                disabled={loading || !!usernameError}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
} 