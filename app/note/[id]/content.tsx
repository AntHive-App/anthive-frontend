import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  source_type: 'file' | 'youtube' | 'audio' | 'text' | 'live';
  source_url: string | null;
}

export default function NoteContentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [note, setNote] = React.useState<Note | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setNote(data);
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#1F2937] justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View className="flex-1 bg-[#1F2937] justify-center items-center">
        <Text className="text-white">Note not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1F2937]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-800 p-2 rounded-xl"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">{note.title}</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <View className="bg-[#374151] rounded-xl p-4">
          <Text className="text-white text-lg font-bold mb-2">Full Transcript</Text>
          <Text className="text-gray-300">{note.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}