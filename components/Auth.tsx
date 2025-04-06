import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Button from './Button';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (type: 'signIn' | 'signUp') => {
    setLoading(true);

    const { data, error } =
      type === 'signIn'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert(error.message);
    } else if (type === 'signUp' && !data?.session) {
      Alert.alert('Please check your inbox for email verification!');
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 pt-20">
          <View className="flex-1 items-center">
            <View className="w-full max-w-md">
              <Text className="text-gray-900 text-3xl font-bold">Welcome to AntHive</Text>
              <Text className="text-gray-500 mt-1 mb-8">Create notes and collaborate with friends</Text>

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
                    onPress={() => handleAuth('signIn')}
                    disabled={loading}
                    variant="primary"
                  />
                </View>
              </View>

              <View className="mt-4 items-center">
                <View className="w-40">
                  <Button
                    label="SIGN UP"
                    onPress={() => handleAuth('signUp')}
                    disabled={loading}
                    variant="outline"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}