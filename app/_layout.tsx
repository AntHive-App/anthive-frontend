import { Stack } from "expo-router";
import Header from '@/components/Header';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <Header />,
        contentStyle: { backgroundColor: '#1F2937' },
      }}
    >
    
    </Stack>
  );
}
