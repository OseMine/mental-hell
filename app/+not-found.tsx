// app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { Background } from '@/src/widgets/Background';

export default function NotFoundScreen() {
  const theme = useTheme(); // Greift auf dein zentrales Material 3 Theme zu

  return (
    <>
      {/* Setzt den Header-Titel für diesen Fehler-Screen */}
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      
      {/* Wir nutzen dein Background-Widget mit scrollable={false}, 
        damit der Inhalt perfekt zentriert auf dem Bildschirm fixiert bleibt.
      */}
      <Background scrollable={false}>
        <View style={styles.container}>
          
          {/* Großes Icon oder Emoji passend zum Thema */}
          <Text style={styles.icon}>🔍</Text>
          
          {/* Material 3 Typografie-Varianten statt festen FontSizes */}
          <Text variant="headlineMedium" style={styles.title}>
            Diese Seite existiert nicht.
          </Text>
          
          <Text 
            variant="bodyMedium" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            Der gesuchte Screen wurde nicht gefunden oder befindet sich noch im Aufbau.
          </Text>

          {/* Expo Router Link verpackt in einen echten Material 3 Button.
            asChild sorgt dafür, dass das Styling auf den Button übertragen wird.
          */}
          <Link href="/" asChild>
            <Button 
              mode="contained" 
              icon="home" 
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Zurück zum Dashboard
            </Button>
          </Link>
          
        </View>
      </Background>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 100, // Material 3 Pill-Shape für Buttons
    width: '100%',
    maxWidth: 280,
  },
  buttonContent: {
    paddingVertical: 6, // Macht den Button etwas griffiger
  },
});