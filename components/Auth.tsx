import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import SignIn from './SignIn';
import SignUp from './SignUp';

type AuthMode = 'signIn' | 'signUp';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signIn');

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 pt-20">
          <View className="flex-1 items-center">
            {mode === 'signIn' ? (
              <SignIn onSwitchToSignUp={() => setMode('signUp')} />
            ) : (
              <SignUp onSwitchToSignIn={() => setMode('signIn')} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}