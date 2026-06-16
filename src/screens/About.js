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
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 56 }}>🐱</Text>
        </View>
        <Text style={styles.title}>Лабиринт для Кати</Text>
        <Text style={styles.version}>Версия 1.1</Text>
        <View style={styles.divider} />
        <Text style={styles.heartText}>Сделано с ❤️</Text>
        <Text style={styles.descText}>специально для самого важного человека</Text>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 24 }}>💌</Text>
          </View>
          <Text style={styles.cardText}>
            Катя, пусть этот маленький лабиринт{'\n'}
            напомнит тебе, что из любой{'\n'}
            ситуации есть выход,{'\n'}
            а в конце всегда ждёт{'\n'}
            награда 🎁
          </Text>
        </View>
        <Text style={styles.devLabel}>Разработчик</Text>
        <Text style={styles.devText}>Матвей</Text>
        <Text style={styles.yearText}>© 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 60 },
  backBtn: { marginBottom: 16 },
  backBtnText: { fontSize: 22, color: COLORS.primaryDark, fontWeight: '600' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  title: { fontSize: 32, color: COLORS.text, textAlign: 'center', fontWeight: '700' },
  version: { fontSize: 15, color: COLORS.textLight, marginTop: 4, marginBottom: 16 },
  divider: { width: 80, height: 2, backgroundColor: COLORS.primary, opacity: 0.2, marginBottom: 20 },
  heartText: { fontSize: 22, color: COLORS.primaryDark, marginBottom: 2, fontWeight: '600' },
  descText: { fontSize: 17, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lavenderLight,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardText: { fontSize: 17, color: COLORS.text, textAlign: 'center', lineHeight: 26 },
  devLabel: { fontSize: 14, color: COLORS.textMuted, marginBottom: 2 },
  devText: { fontSize: 18, color: COLORS.text, fontWeight: '600', marginBottom: 4 },
  yearText: { fontSize: 13, color: COLORS.textMuted },
});
