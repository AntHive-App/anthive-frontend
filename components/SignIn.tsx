import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Button from './Button';

interface SignInProps {
  onSwitchToSignUp: () => void;
}

export default function SignIn({ onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (signInError.message.includes('fetch') || signInError.message.includes('network')) {
        setError('Server is down. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <View className="w-full max-w-md">
      <Text className="text-white text-3xl font-bold">Welcome to AntHive</Text>
      <Text className="text-white mt-1 mb-8">Create notes and collaborate with friends</Text>

      {error && (
        <Text className="text-red-500 text-sm mb-4">
          {error}
        </Text>
      )}

      <View className="mt-5">
        <Text className="text-gray-600 text-xs font-bold mb-1">EMAIL ADDRESS</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
          placeholder="email@address.com"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="mt-4">
        <Text className="text-gray-600 text-xs font-bold mb-1">PASSWORD</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900"
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="mt-8 items-center">
        <View className="w-40">
          <Button
            label="SIGN IN"
            onPress={handleSignIn}
            disabled={loading}
            variant="primary"
          />
        </View>
      </View>

      <View className="mt-4 items-center">
        <TouchableOpacity onPress={onSwitchToSignUp}>
          <Text className="text-sky-400 text-sm">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};