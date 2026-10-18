import { Text } from '@/components/ui/text';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import '@/global.css';
import { queryClient } from '@/lib/queryClient';
import { NAV_THEME } from '@/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUniwind } from 'uniwind';

export default function RootLayout() {
  const { theme } = useUniwind();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-destructive">
          Migration error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
          <StatusBar
            style={'light'}
          // style={theme === 'dark' ? 'light' : 'dark'}
          />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}