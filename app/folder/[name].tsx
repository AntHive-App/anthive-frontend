import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AddContentModal from '@/components/AddContentModal';

interface Note {
  id: string;
  title: string;
  content: string;
  source_type: 'file' | 'youtube' | 'audio' | 'text' | 'live';
  source_url: string | null;
  summary: string | null;
  created_at: string;
}

export default function FolderScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchNotes();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.id) setUserId(data.user.id);
    });
  }, [name]);

  const fetchNotes = async () => {
    try {
      const { data: folder } = await supabase
        .from('folders')
        .select('id')
        .eq('name', name)
        .single();

      if (!folder) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('folder_id', folder.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const { data: folder } = await supabase
        .from('folders')
        .select('id')
        .eq('name', name)
        .single();

      if (!folder) throw new Error('Folder not found');

      const { error } = await supabase
        .from('notes')
        .insert([
          {
            title: 'New Note',
            content: input.trim(),
            source_type: 'text',
            folder_id: folder.id,
            user_id: userId
          }
        ]);

      if (error) throw error;
      setInput('');
      fetchNotes();
    } catch (error) {
      console.error('Error sending note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = (type: 'text' | 'audio' | 'youtube' | 'file') => {
    setShowAddModal(false);
    // TODO: Implement handlers for different content types
    if (type === 'text') {
      // Text input is already available
    } else if (type === 'audio') {
      // Implement audio recording
    } else if (type === 'file') {
      // Implement file upload
    } else if (type === 'youtube') {
      // Implement YouTube link
    }
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View className="bg-[#1F2937] border border-gray-300 rounded-xl p-4 mb-3">
      <Text className="text-white font-bold">{item.title}</Text>
      <Text className="text-white mt-2">{item.content}</Text>
      {item.summary && (
        <Text className="text-gray-400 text-sm mt-2">{item.summary}</Text>
      )}
      <Text className="text-gray-300 text-xs mt-2">
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-gray-400 text-lg text-center mb-2">
        No content yet
      </Text>
      <Text className="text-gray-400 text-center mb-8">
        Add your first content to get started
      </Text>
      <View className="flex-row flex-wrap justify-center gap-4">
      <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-40"
          onPress={() => handleSelectType('file')}
        >
          <Ionicons name="document" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-40"
          onPress={() => handleSelectType('text')}
        >
          <Ionicons name="document-text" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-40"
          onPress={() => handleSelectType('audio')}
        >
          <Ionicons name="musical-notes" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-40"
          onPress={() => handleSelectType('youtube')}
        >
          <Ionicons name="logo-youtube" size={32} color="#FF0000" />
          <Text className="text-white mt-2">YouTube</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#1F2937]">
      <View className="flex-row items-center justify-between p-4 ">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-800 p-2 rounded-xl"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">{name}</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1">
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyState}
        />
      </View>

      {notes.length > 0 && (
        <View className="p-4 border-t border-gray-700">
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              className="bg-gray-800 p-3 rounded-xl"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
            
            <TextInput
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              multiline
            />
            
            <TouchableOpacity
              onPress={handleSend}
              disabled={loading || !input.trim()}
              className="bg-sky-500 p-3 rounded-xl"
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AddContentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        folderName={name as string}
        userId={userId}
      />
    </View>
  );
} 