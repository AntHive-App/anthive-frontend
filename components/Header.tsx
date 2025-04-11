import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();


  const handleAccountPress = () => {
    if (pathname !== '/account') {
      router.push('/account' as any);
    }
  };

  return (
    <View className="bg-[#1F2937] p-4 border-b border-gray-700">
      <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center">
          <Ionicons name="logo-github" size={32} color="white" />
          <Text className="text-white text-xl font-bold ml-2"></Text>
        </View>
        <TouchableOpacity
          onPress={handleAccountPress}
          className="bg-gray-600 p-2 rounded-xl"
        >
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
} 