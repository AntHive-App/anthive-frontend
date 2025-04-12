import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { View, Alert, SafeAreaView, TouchableOpacity, Text, TextInput } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Button from './Button'
// TODO: error handling for username length and special characters use set error to indicate errors
export default function Account({ session }: { session: Session; }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')


  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username
  }: {
    username: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1F2937]">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 mt-3 px-4 items-center">
        <View className="w-full max-w-md">
          <View className="mt-5">
            <Text className="text-gray-600 text-sm font-medium mb-1">Email</Text>
            <TextInput
              value={session?.user?.email || ''}
              editable={false}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            />
          </View>
          <View className="mt-4">
            <Text className="text-gray-600 text-sm font-medium mb-1">Username</Text>
            <TextInput
              value={username || ''}
              onChangeText={setUsername}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
            />
          </View>


          <View className="mt-8 flex items-center">
            <View className="w-40">
              <Button
                label={loading ? 'Loading ...' : 'Update Profile'}
                onPress={() => updateProfile({ username })}
                disabled={loading}
                variant="primary"
              />
            </View>
          </View>

          <View className="mt-4 flex items-center">
            <View className="w-40">
              <Button
                label="Sign Out"
                onPress={() => supabase.auth.signOut()}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

