import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  ScrollView,
}
  from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import ProfileSetupModal from '@/components/modals/ProfileSetupModal';
import CreateFolderModal from '@/components/modals/CreateFolderModal';
import DeleteFolderModal from '@/components/modals/DeleteFolderModal';

interface Folder {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface HomeScreenProps {
  session: Session;
}
// TODO: error handling for username length and special characters use set error to indicate errors
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  searchContainer: {
    ...Platform.select({
      web: {
        width: '20%',
      },
      default: {
        flex: 1,
        maxWidth: '80%',
      }
    }),
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  folderListContainer: {
    width: Platform.OS === 'web' ? '60%' : '95%',
    alignSelf: 'center',
    marginTop: 16,
  },
  createFolderContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',

  },
  createFolderButton: {
    width: 160,
  },
  folderList: {
    paddingBottom: 128,
  },
  webScrollContainer: {
    maxHeight: 600,
  },
});

export default function HomeScreen({ session }: HomeScreenProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      getProfile();
      fetchFolders();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      } else {
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  const handleDeleteFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setShowDeleteModal(true);
  };

  const onFolderDeleted = () => {
    fetchFolders();
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-gray-400 text-lg text-center mb-2">
        No folders yet
      </Text>
      <Text className="text-gray-400 text-center mb-8">
        Create your first folder to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1F2937]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-lg text-gray-900"
              placeholder="Search folders..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              style={{ height: 40, paddingVertical: 0 }}
            />
          </View>
        </View>

      </View>

      {/* Content Container */}
      <View style={styles.folderListContainer}>
        {Platform.OS === 'web' ? (
          <ScrollView style={styles.webScrollContainer}>
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.folderList}
              ListEmptyComponent={renderEmptyState}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="rounded-xl p-4 mb-3"
                  style={{
                    backgroundColor: "#374151"
                  }}
                  onPress={() => router.push(`/folder/${item.name}` as any)}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-white font-medium text-lg">
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text className="text-white text-sm mt-1">
                          {item.description}
                        </Text>
                      )}
                      <Text className="text-white text-sm mt-1">
                        
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(item.id);
                      }}
                      className="p-2"
                    >
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </ScrollView>
        ) : (
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.folderList}
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="rounded-xl p-4 mb-3"
                style={{
                  backgroundColor: "#374151"
                }}
                onPress={() => router.push(`/folder/${item.name}` as any)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-white font-medium text-lg">
                      {item.name}
                    </Text>
                    {item.description && (
                      <Text className="text-white text-sm mt-1">
                        {item.description}
                      </Text>
                    )}
                    <Text className="text-white text-sm mt-1">
                   
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(item.id);
                    }}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Create Folder Button - Fixed at bottom */}
      <View style={styles.createFolderContainer}>
        <View style={styles.createFolderButton}>
          <Button
            label="CREATE A FOLDER"
            onPress={() => setShowCreateFolder(true)}
            variant="primary"
          />
        </View>
      </View>

      <ProfileSetupModal
        visible={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        userId={session.user.id}
      />

      <CreateFolderModal
        visible={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        userId={session.user.id}
      />

      <DeleteFolderModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        folderId={selectedFolderId || ""}
        onDelete={onFolderDeleted}
      />
    </SafeAreaView>
  );
}
