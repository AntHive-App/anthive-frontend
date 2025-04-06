import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js'
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Button from './Button';
import { useRouter } from 'expo-router';
import Account from './Account';

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export default function MainScreen({ session }: { session: Session }) {
  const [showAccount, setShowAccount] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);

  if (showAccount) {
    return <Account session={session} onBack={() => setShowAccount(false)} />;
  }

  const handleCreateFolder = () => {
    // TODO: Implement folder creation logic
    console.log('Create folder');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-gray-500 text-lg text-center mb-2">
        No class folders yet
      </Text>
      <Text className="text-gray-400 text-center mb-8">
        Create your first class folder to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
        <View className="flex-1 mr-4 max-w-md">
          <View className="flex-row items-center bg-white rounded-lg px-4 py-2">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900"
              placeholder="Search class folders..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowAccount(true)}
          className="p-2"
        >
          <Ionicons name="settings-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View className="flex-1 items-center px-4">
        <View className="w-full max-w-2xl">
          {/* Folder List */}
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            contentContainerClassName="w-full pt-4"
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                onPress={() => router.push(`../folder-${item.id}`)}
              >
                <View className="flex-row items-center">
                  <Ionicons name="folder" size={24} color="#38BDF8" />
                  <Text className="ml-3 text-gray-900 font-medium text-lg">
                    {item.name}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  Created {item.createdAt.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Create Folder Button */}
          <View className="py-4 items-center">
            <View className="w-40">
              <Button
                label="CREATE A FOLDER"
                onPress={handleCreateFolder}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} 