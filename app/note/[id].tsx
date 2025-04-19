import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import EditNoteModal from '@/components/modals/EditNoteModal';

interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  source_type: 'file' | 'youtube' | 'audio' | 'text' | 'live';
  source_url: string | null;
}

export default function NoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [note, setNote] = React.useState<Note | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showEditModal, setShowEditModal] = React.useState(false);

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

  const handleListenPodcast = () => {
    // Implement podcast functionality
    console.log('Listen to podcast');
  };

  const handleTakeQuiz = () => {
    // Implement quiz functionality
    console.log('Take quiz');
  };

  const handleEditNote = () => {
    if (!note) return;
    setShowEditModal(true);
  };

  const handleUpdateNote = () => {
    fetchNote();
  };

  const handleGenerateFlashcards = () => {
    // Implement flashcards functionality
    console.log('Generate flashcards');
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

      {/* Action Buttons */}
      <View className="flex-row justify-around p-4 border-b border-gray-700">
      <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-28"
          onPress={handleGenerateFlashcards}
        >
          <Ionicons name="albums" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Flashcards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-28"
          onPress={handleTakeQuiz}
        >
          <Ionicons name="help-circle" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-28"
          onPress={handleListenPodcast}
        >
          <Ionicons name="play-circle" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Listen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-28"
          onPress={handleEditNote}
        >
          <Ionicons name="create" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#374151] p-4 rounded-xl items-center w-28"
          onPress={() => router.push({
            pathname: '/note/[id]/content',
            params: { id: note.id }
          })}
        >
          <Ionicons name="document-text" size={32} color="#FFFFFF" />
          <Text className="text-white mt-2">Full Transcript</Text>
        </TouchableOpacity>

        
      </View>

      {/* Edit Modal */}
      <EditNoteModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        note={note!}
        onUpdate={handleUpdateNote}
      />

      {/* Note Content */}
      <ScrollView className="flex-1 p-4">
        <View className="bg-[#374151] rounded-xl p-4 mb-4">
          <Text className="text-white text-lg font-bold mb-2">Summary</Text>
          <Text className="text-gray-300">{note.summary || 'No summary available'}</Text>
        </View>
      </ScrollView>
    </View>
  );
} 