import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

interface Folder {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function FolderPage() {
  const { name } = useLocalSearchParams();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('name', name)
          .single();

        if (error) throw error;
        setFolder(data);
      } catch (error) {
        console.error('Error fetching folder:', error);
        setError('Failed to load folder');
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [name]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#141F23]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error || !folder) {
    return (
      <View className="flex-1 justify-center items-center bg-[#141F23]">
        <Text className="text-white text-lg">{error || 'Folder not found'}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#141F23] p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold">{folder.name}</Text>
        {folder.description && (
          <Text className="text-gray-400 mt-2">{folder.description}</Text>
        )}
      </View>
    </View>
  );
} 