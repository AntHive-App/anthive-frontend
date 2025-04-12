import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

interface TextInputModalProps {
    visible: boolean;
    onClose: () => void;
    onSend: (text: string) => void;
    folderId: string;
    userId: string;
}

export default function TextInputModal({ visible, onClose, onSend, folderId, userId }: TextInputModalProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            setLoading(true);

            const payload = {
                title: 'New Note',
                content: text.trim(),
                user_id: userId,
                folder_id: folderId,
                source_type: 'text'
            };

            const response = await fetch('http://192.168.1.100:8001/process-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to process note');
            }

            // Clear text and close modal first
            setText('');
            onClose();

            // Then trigger the refresh
            onSend(text);
        } catch (error) {
            console.error('Error sending note:', error);
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Text</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="Enter your text here..."
                        placeholderTextColor="#9CA3AF"
                        value={text}
                        onChangeText={setText}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            label={loading ? "Sending..." : "Send"}
                            onPress={handleSend}
                            variant="primary"
                            disabled={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    closeButton: {
        padding: 4,
    },
    textInput: {
        backgroundColor: '#374151',
        borderRadius: 8,
        padding: 12,
        minHeight: 200,
        color: 'white',
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 16,
    },
}); 