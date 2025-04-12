import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const styles = StyleSheet.create({
  settingsButton: {
    position: 'absolute',
    right: 16,
  },
});

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleAccountPress = () => {
    if (pathname !== '/account') {
      router.push('/account');
    }
  };

  return (
    <SafeAreaView className="bg-[#1F2937] p-4 border-b border-gray-700">
      <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center">
          <Ionicons name="logo-github" size={32} color="white" />
          <Text className="text-white text-xl font-bold ml-2"></Text>
        </View>
        <TouchableOpacity
          onPress={handleAccountPress}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 