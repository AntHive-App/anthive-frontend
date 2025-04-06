import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';

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
    <View className="flex-1 bg-[#14001D]">
      <StatusBar barStyle="light-content" backgroundColor="#14001D" />
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5 pt-20">
          <Text className="text-white text-3xl font-bold">Welcome to AntHive</Text>
          <Text className="text-gray-400 mt-1 mb-8">Create notes and collaborate with friends</Text>

          <Text className="text-white text-xs font-bold mt-2 mb-1">EMAIL ADDRESS</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 text-base"
            placeholder="email@address.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-white text-xs font-bold mt-6 mb-1">PASSWORD</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 text-base"
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => handleAuth('signIn')}
            disabled={loading}
            className="bg-gray-200 py-3.5 rounded-xl mt-8 shadow-[0_8px_0_rgb(180,180,180,0.5)]"
          >
            <Text className="text-center font-bold text-black">SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAuth('signUp')}
            disabled={loading}
            className="bg-gray-200 py-3.5 rounded-xl mt-4 mb-10 shadow-[0_8px_0_rgb(180,180,180,0.5)]"
          >
            <Text className="text-center font-bold text-black">SIGN UP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}