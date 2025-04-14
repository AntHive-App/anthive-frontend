import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AddContentModal from '@/components/modals/AddContentModal';
import TextInputModal from '@/components/modals/TextInputModal';
import NoteSummaryModal from '@/components/modals/NoteSummaryModal';
import FileUploadModal from '@/components/modals/FileUploadModal';

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
  const [showTextModal, setShowTextModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

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
      setFolderId(folder.id);

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

  const handleSelectType = (type: 'text' | 'audio' | 'youtube' | 'file') => {
    setShowAddModal(false);
    if (type === 'text') {
      setShowTextModal(true);
    } else if (type === 'file') {
      setShowFileModal(true);
    } else if (type === 'youtube') {
      // Implement YouTube link
    }
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() => setSelectedNote(item)}
      className="bg-[#374151] border border-gray-700 rounded-xl p-4 mb-3"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-bold">{item.title || 'Untitled Note'}</Text>
      </View>
      <Text className="text-gray-300 mt-2" numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
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
          onPress={() => setShowTextModal(true)}
        >
          <Ionicons name="document-text" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Text</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-40"
          onPress={() => handleSelectType('audio')}
        >
          <Ionicons name="musical-notes" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Audio</Text>
        </TouchableOpacity> */}
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
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity
          onPress={() => router.push('/')}
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
          contentContainerStyle={{
            width: Platform.OS === 'web' ? '60%' : '95%',
            alignSelf: 'center',
            padding: 16,
          }}
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

      <TextInputModal
        visible={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSend={() => fetchNotes()}
        folderId={folderId}
        userId={userId}
      />

      <FileUploadModal
        visible={showFileModal}
        onClose={() => setShowFileModal(false)}
        folderId={folderId}
        userId={userId}
        onUploadComplete={fetchNotes}
      />

      <NoteSummaryModal
        visible={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title || ''}
        content={selectedNote?.content || ''}
        summary={selectedNote?.summary || ''}
      />
    </View>
  );
} 