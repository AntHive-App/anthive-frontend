import { useState, useEffect } from 'react'
import "../global.css" 
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth' 
import Account from '../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import MainScreen from '@/components/MainScreen'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View className="min-h-screen bg-[#14001D]">
      {session && session.user ? <MainScreen key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}