import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../constants';

export default function About({ onBack }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backBtnText}>← Назад</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={{ fontSize: 64, marginBottom: 12 }}>🐱</Text>
        <Text style={styles.title}>Лабиринт для Кати</Text>
        <Text style={styles.version}>Версия 1.0</Text>
        <View style={styles.divider} />
        <Text style={styles.heartText}>Сделано с ❤️</Text>
        <Text style={styles.descText}>специально для самого важного человека</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Катя, пусть этот маленький лабиринт{'\n'}
            напомнит тебе, что из любой{'\n'}
            ситуации есть выход,{'\n'}
            а в конце всегда ждёт{'\n'}
            награда 🎁
          </Text>
        </View>
        <Text style={styles.devText}>Разработчик: Матвей</Text>
        <Text style={styles.yearText}>© 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backBtn: { marginBottom: 16 },
  backBtnText: { fontSize: 22, color: COLORS.primaryDark },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  title: { fontSize: 32, color: COLORS.text, textAlign: 'center' },
  version: { fontSize: 16, color: COLORS.textLight, marginTop: 4, marginBottom: 16 },
  divider: { width: 80, height: 2, backgroundColor: COLORS.primary, opacity: 0.3, marginBottom: 20 },
  heartText: { fontSize: 24, color: COLORS.primaryDark, marginBottom: 4 },
  descText: { fontSize: 18, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  cardText: { fontSize: 18, color: COLORS.text, textAlign: 'center', lineHeight: 28 },
  devText: { fontSize: 16, color: COLORS.textLight, marginBottom: 4 },
  yearText: { fontSize: 14, color: COLORS.textLight },
});
