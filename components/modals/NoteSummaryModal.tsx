import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NoteSummaryModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    content: string;
    summary?: string;
}

export default function NoteSummaryModal({ visible, onClose, title, content, summary }: NoteSummaryModalProps) {
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
                        <Text style={styles.modalTitle}>{title || 'Note Summary'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        {summary ? (
                            <>
                                <Text style={styles.summaryLabel}>Summary:</Text>
                                <Text style={styles.summaryText}>{summary}</Text>
                            </>
                        ) : (
                            <Text style={styles.contentText}>{content}</Text>
                        )}
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
    contentContainer: {
        padding: 12,
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 8,
    },
    summaryText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
    },
    contentText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
    },
}); 