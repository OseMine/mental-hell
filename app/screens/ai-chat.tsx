import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, TextInput, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';
import { router } from 'expo-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function generateResponse(userMessage: string, logsCount: number, avgMood: number, streak: number): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('mood') || lower.includes('stimmung') || lower.includes('feel') || lower.includes('fühle')) {
    if (logsCount === 0) return "You haven't logged any check-ins yet. Start tracking your mood to get personalized insights!";
    return `Based on your data, your average mood is ${avgMood.toFixed(1)}/10 over ${logsCount} entries. ${
      avgMood >= 7 ? "That's great! Your emotional well-being seems positive." :
      avgMood >= 4 ? "That's moderate. Consider mindfulness exercises or talking to someone." :
      "That's low. Please reach out to a mental health professional."
    }`;
  }

  if (lower.includes('stress') || lower.includes('stress')) {
    if (logsCount === 0) return "No stress data available yet. Complete some check-ins to see trends.";
    return `Your stress levels average around ${avgMood > 5 ? 'moderate' : 'manageable'} levels. ${
      avgMood > 7 ? "Consider taking breaks and practicing relaxation techniques." : "You seem to be managing stress well."
    }`;
  }

  if (lower.includes('streak') || lower.includes('serie') || lower.includes('consistency')) {
    return `You're on a ${streak}-day streak! ${streak > 0 ? `Consistency is key to understanding your mental health patterns.` : 'Start a streak by completing your daily check-ins.'}`;
  }

  if (lower.includes('tip') || lower.includes('advice') || lower.includes('tipp') || lower.includes('rat')) {
    const tips = [
      "Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
      "Deep breathing for 60 seconds can help regulate your nervous system.",
      "Regular physical activity, even a 10-minute walk, boosts mood significantly.",
      "Maintaining a consistent sleep schedule improves emotional regulation.",
      "Journaling for 5 minutes before bed helps process daily emotions.",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  if (lower.includes('gratitude') || lower.includes('dankbar')) {
    return "Practicing gratitude daily can rewire your brain for positivity. Try listing 3 things you're grateful for each day!";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('hallo')) {
    return `Hello! I'm your mental health companion. You can ask me about your mood trends, stress levels, streaks, or mental health tips. How can I help?`;
  }

  return `I'm here to help you reflect on your mental health data. You can ask about your mood, stress levels, streaks, or request well-being tips. ${
    logsCount > 0 ? `You have ${logsCount} check-in entries I can analyze.` : 'Start by completing some daily check-ins!'
  }`;
}

export default function AIChatScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { dailyLogs, getStreak } = useHealthStore();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'Hello! I\'m your mental health companion. I can help you understand your mood patterns, stress levels, and provide well-being tips. What would you like to know?',
    timestamp: Date.now(),
  }]);
  const [inputText, setInputText] = useState('');

  const avgMood = useMemo(() => {
    if (dailyLogs.length === 0) return 0;
    return dailyLogs.reduce((s, l) => s + l.mood_score, 0) / dailyLogs.length;
  }, [dailyLogs]);

  const streak = getStreak();

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const response = generateResponse(userMsg.content, dailyLogs.length, avgMood, streak);
      const assistantMsg: Message = {
        id: `resp_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  };

  return (
    <Background scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
            AI Chat
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            Free · Privacy-first · Local analysis
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.duration(400).delay(index > 0 ? 0 : 0).springify().damping(22).stiffness(180)}
              style={[
                styles.messageRow,
                item.role === 'user' ? styles.userRow : styles.assistantRow,
              ]}
            >
              <CustomCard
                glass
                style={[
                  styles.messageBubble,
                  item.role === 'user'
                    ? { backgroundColor: theme.colors.primaryContainer, borderBottomRightRadius: 4 }
                    : { borderBottomLeftRadius: 4 },
                ]}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: item.role === 'user' ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                    lineHeight: 22,
                  }}
                >
                  {item.content}
                </Text>
              </CustomCard>
            </Animated.View>
          )}
        />

        <View style={[styles.inputBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
          <TextInput
            style={[styles.input, {
              backgroundColor: theme.colors.surfaceVariant,
              color: theme.colors.onSurface,
              borderColor: theme.colors.outlineVariant,
            }]}
            placeholder="Ask about your mental health..."
            placeholderTextColor={theme.colors.outline}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
          <Button
            mode="contained"
            onPress={handleSend}
            style={styles.sendBtn}
            contentStyle={styles.sendBtnContent}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 12, paddingHorizontal: 16, paddingTop: 8 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 12 },
  messageRow: { marginBottom: 10 },
  userRow: { alignItems: 'flex-end' },
  assistantRow: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendBtn: { borderRadius: 20, minWidth: 44, height: 44 },
  sendBtnContent: { paddingHorizontal: 12 },
});