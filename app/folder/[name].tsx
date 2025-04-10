import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AddContentModal from '@/components/AddContentModal';

interface Note {
  id: string;
  content: string;
  created_at: string;
  type: 'text' | 'audio' | 'pdf' | 'youtube';
}

export default function FolderScreen() {
  const { name } = useLocalSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [name]);

  const fetchNotes = async () => {
    try {
    //   const { data, error } = await supabase
    //     .from('notes')
    //     .select('*')
    //     .eq('folder_name', name)
    //     .order('created_at', { ascending: false });

    //   if (error) throw error;
    //   setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
    //   const { error } = await supabase
    //     .from('notes')
    //     .insert([
    //       {
    //         content: input.trim(),
    //         folder_name: name,
    //         type: 'text'
    //       }
    //     ]);

    //   if (error) throw error;
    //   setInput('');
    //   fetchNotes();
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
    <View className="bg-gray-800 border border-gray-300 rounded-xl p-4 mb-3">
      <Text className="text-white">{item.content}</Text>
      <Text className="text-gray-300 text-xs mt-2">
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-1">
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          inverted
        />
      </View>

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

      <AddContentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectType={handleSelectType}
      />
    </View>
  );
} 