import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore, TodoItem } from '@/src/store/healthStore';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';

export function TodoSection() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { todos, addTodo, toggleTodo, deleteTodo, getTodosForToday } = useHealthStore();
  const [newTodoText, setNewTodoText] = useState('');

  const todayTodos = getTodosForToday();
  const completedCount = todayTodos.filter((t) => t.completed).length;

  const handleAdd = () => {
    if (!newTodoText.trim()) return;
    addTodo({
      text: newTodoText.trim(),
      completed: false,
      date: new Date().toDateString(),
    });
    setNewTodoText('');
  };

  return (
    <CustomCard glass>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          {t('todos.title')}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
          {todayTodos.length > 0
            ? t('todos.completed', { count: completedCount, total: todayTodos.length })
            : ''}
        </Text>
      </View>

      <View style={{ backgroundColor: theme.colors.surfaceVariant, borderRadius: 100, height: 4, marginBottom: 12, overflow: 'hidden' }}>
        <View style={{ width: `${todayTodos.length > 0 ? (completedCount / todayTodos.length) * 100 : 0}%`, backgroundColor: theme.colors.primary, height: '100%', borderRadius: 100 }} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.colors.surfaceVariant,
            color: theme.colors.onSurface,
            borderColor: theme.colors.outlineVariant,
          }]}
          placeholder={t('todos.todoPlaceholder')}
          placeholderTextColor={theme.colors.outline}
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          onPress={handleAdd}
          style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {todayTodos.length === 0 && !newTodoText ? (
        <Text variant="bodyMedium" style={[styles.empty, { color: theme.colors.outline }]}>
          {t('todos.empty')}
        </Text>
      ) : (
        todayTodos.map((todo, i) => (
          <Animated.View
            key={todo.id}
            entering={FadeInDown.duration(300).delay(i * 40).springify().damping(22).stiffness(180)}
            layout={Layout.springify()}
            style={[styles.todoRow, { borderBottomColor: theme.colors.outlineVariant }]}
          >
            <TouchableOpacity
              onPress={() => toggleTodo(todo.id)}
              style={styles.todoCheck}
            >
              <Ionicons
                name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={todo.completed ? theme.colors.primary : theme.colors.outline}
              />
            </TouchableOpacity>
            <Text
              variant="bodyMedium"
              style={[
                styles.todoText,
                {
                  color: todo.completed ? theme.colors.outline : theme.colors.onSurface,
                  textDecorationLine: todo.completed ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={1}
            >
              {todo.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          </Animated.View>
        ))
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: '700' },

  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderWidth: 1 },
  addBtn: { borderRadius: 10, width: 42, height: 42, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', paddingVertical: 16 },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  todoCheck: { marginRight: 2 },
  todoText: { flex: 1, fontWeight: '500' },
});