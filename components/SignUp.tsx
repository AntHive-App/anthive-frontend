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

interface SignUpProps {
  onSwitchToSignIn: () => void;
}

export default function SignUp({ onSwitchToSignIn }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Please check your email for verification!');
      onSwitchToSignIn();
    }
    setLoading(false);
  };

  return (
    <View className="w-full max-w-md">
      <Text className="text-white text-3xl font-bold">Create Account</Text>
      <Text className="text-white mt-1 mb-8">Join AntHive and start collaborating</Text>

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
            label="SIGN UP"
            onPress={handleSignUp}
            disabled={loading}
            variant="primary"
          />
        </View>
      </View>

      <View className="mt-4 items-center">
        <TouchableOpacity onPress={onSwitchToSignIn}>
          <Text className="text-sky-400 text-sm">
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 