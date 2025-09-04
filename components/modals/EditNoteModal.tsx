import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
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

interface EditNoteModalProps {
  visible: boolean;
  onClose: () => void;
  note: Note;
  onUpdate: () => void;
}

export default function EditNoteModal({ visible, onClose, note, onUpdate }: EditNoteModalProps) {
  const [title, setTitle] = React.useState(note.title);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setTitle(note.title);
  }, [note]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title })
        .eq('id', note.id);

      if (error) throw error;
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-[#1F2937] rounded-lg p-6 w-11/12 max-w-md">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Edit Note</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Edit Form */}
          <View className="bg-[#374151] rounded-xl p-4">
            <Text className="text-white text-lg font-bold mb-2">Title</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-3 mb-4"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter note title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-sky-500 p-3 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-bold">
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 