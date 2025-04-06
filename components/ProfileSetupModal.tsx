import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { useDebounce } from '../hooks/useDebounce';

interface ProfileSetupModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

export default function ProfileSetupModal({ visible, onClose, userId }: ProfileSetupModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  const debouncedUsername = useDebounce(username, 1000);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!debouncedUsername.trim()) {
        setUsernameError('');
        return;
      }

      setCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', debouncedUsername.trim())
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking username:', error);
          return;
        }

        setUsernameError(data ? 'Username already exists' : '');
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setCheckingUsername(false);
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsername]);

  const handleCreateProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
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

  const handleUsernameChange = (text: string) => {
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
            <View className="relative">
              <TextInput
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
                placeholder="Choose a username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={username}
                onChangeText={handleUsernameChange}
              />
              {checkingUsername && (
                <ActivityIndicator className="absolute right-3 top-3" />
              )}
            </View>
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