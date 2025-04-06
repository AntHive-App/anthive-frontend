import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-[#14001D] px-5 pt-20">
      <Text className="text-white text-3xl font-bold">Let’s Login</Text>
      <Text className="text-gray-400 mt-1 mb-8">And notes your idea</Text>

      <Text className="text-white text-xs font-bold mt-2 mb-1">EMAIL ADDRESS</Text>
      <StyledTextInput
        className="bg-white rounded-lg px-4 py-3 text-base"
        placeholder="email@address.com"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text className="text-white text-xs font-bold mt-6 mb-1">PASSWORD</Text>
      <StyledTextInput
        className="bg-white rounded-lg px-4 py-3 text-base"
        placeholder="********"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={signInWithEmail}
        disabled={loading}
        className="bg-gray-200 py-3.5 rounded-xl mt-8"
      >
        <Text className="text-center font-bold text-black">SIGN IN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signUpWithEmail}
        disabled={loading}
        className="bg-gray-200 py-3.5 rounded-xl mt-4"
      >
        <Text className="text-center font-bold text-black">SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}
