import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useMaterial3Theme } from 'react-native-material3-theme';
import 'react-native-reanimated';

export {
  // Erlaubt Expo Router das Abfangen von fatalen Rendering-Fehlern
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Sorgt dafür, dass beim Neuladen im Modal der Zurück-Button erhalten bleibt
  initialRouteName: '(tabs)',
};

// Verhindert das automatische Ausblenden des Ladebildschirms
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  
  // Holt die offiziellen Material 3 Systemfarben (inklusive Android Monet)
  const { theme } = useMaterial3Theme();

  // Verschmilzt das reaktive Farbset mit den Material 3 Kern-Themes
  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    // Der PaperProvider muss ganz außen liegen, damit alle Kind-Komponenten Zugriff auf M3 haben
    <PaperProvider theme={paperTheme}>
      <Stack>
        {/* Haupt-Tabnavigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Das Info-Modal, welches von unten reinslide-effektet */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerTitle: 'Informationen',
            headerStyle: {
              backgroundColor: paperTheme.colors.surface,
            },
            headerTintColor: paperTheme.colors.onSurface,
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}