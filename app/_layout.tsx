import { Stack } from 'expo-router';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Awaab', headerShown: false }} />
      <Stack.Screen name="(session)/after-salah" options={{ title: 'After Salah' }} />
      <Stack.Screen name="(session)/morning" options={{ title: 'Morning Adhkar' }} />
      <Stack.Screen name="(session)/evening" options={{ title: 'Evening Adhkar' }} />
      <Stack.Screen name="progress/index" options={{ title: 'Progress' }} />
    </Stack>
  );
}
