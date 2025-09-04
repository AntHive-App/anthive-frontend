import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/services/api';

interface TextInputModalProps {
    visible: boolean;
    onClose: () => void;
    onSend: () => void;
    folderId: string;
    userId: string;
}

export default function TextInputModal({ visible, onClose, onSend, folderId, userId }: TextInputModalProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!text.trim() || loading) return;

        try {
            setLoading(true);

            await api.processNote({
                title: 'New Note',
                content: text.trim(),
                user_id: userId,
                folder_id: folderId,
                source_type: 'text'
            });

            setText('');
            onSend();
            onClose();
        } catch (error) {
            console.error('Error sending text:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-[#1F2937] rounded-lg p-6 w-11/12 max-w-md -mt-20">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-white text-xl font-bold">Add Text</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        className="bg-[#374151] text-white rounded-lg p-4 mb-4"
                        placeholder="Enter your text..."
                        placeholderTextColor="#9CA3AF"
                        value={text}
                        onChangeText={setText}
                        multiline
                        style={{ maxHeight: 120 }}
                        scrollEnabled
                    />

                    <TouchableOpacity
                        className="bg-sky-500 rounded-lg p-4 items-center"
                        onPress={handleSend}
                        disabled={loading || !text.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold">Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
} 