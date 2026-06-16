import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, CONTROL_MODES } from '../constants';

export default function Settings({ onBack, settings, onUpdateSettings, onResetProgress, hasProgress }) {
  const [controlMode, setControlMode] = useState(settings.controlMode);
  const [vibrationEnabled, setVibrationEnabled] = useState(settings.vibrationEnabled ?? true);

  const update = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleVibrationToggle = () => {
    const newVal = !vibrationEnabled;
    setVibrationEnabled(newVal);
    update('vibrationEnabled', newVal);
  };

  const handleControlMode = (mode) => {
    setControlMode(mode);
    update('controlMode', mode);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Сбросить прогресс',
      'Все пройденные уровни будут закрыты. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: onResetProgress },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Настройки</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Управление</Text>
          <Text style={styles.sectionIcon}>🎮</Text>
          {CONTROL_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.controlRow, controlMode === mode.id && styles.controlRowActive]}
              onPress={() => handleControlMode(mode.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.controlIcon}>{mode.icon}</Text>
              <Text style={[styles.controlLabel, controlMode === mode.id && styles.controlLabelActive]}>
                {mode.label}
              </Text>
              <View style={[styles.radio, controlMode === mode.id && styles.radioActive]}>
                {controlMode === mode.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Дополнительно</Text>
          <Text style={styles.sectionIcon}>⚙️</Text>
          <TouchableOpacity style={styles.toggleRow} onPress={handleVibrationToggle}>
            <Text style={styles.toggleLabel}>Вибрация</Text>
            <View style={[styles.toggle, vibrationEnabled && styles.toggleActive]}>
              <View style={[styles.toggleCircle, vibrationEnabled && styles.toggleCircleActive]} />
            </View>
          </TouchableOpacity>
          {hasProgress && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleResetProgress} activeOpacity={0.7}>
              <Text style={styles.resetBtnText}>🗑 Сбросить прогресс</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>
            👆 Свайпы — проведи по лабиринту{'\n'}
            🔘 Кнопки — нажми стрелки{'\n'}
            📱 Наклон — поверни телефон
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 24, paddingTop: 60 },
  header: { marginBottom: 20 },
  backBtn: { marginBottom: 12 },
  backBtnText: { fontSize: 22, color: COLORS.primaryDark, fontWeight: '600' },
  title: { fontSize: 32, color: COLORS.text, fontWeight: '700' },
  section: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 12,
    elevation: 2, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8,
    position: 'relative',
  },
  sectionTitle: { fontSize: 22, color: COLORS.text, fontWeight: '600', marginBottom: 16 },
  sectionIcon: { position: 'absolute', top: 20, right: 20, fontSize: 24, opacity: 0.3 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  toggleLabel: { fontSize: 18, color: COLORS.text, fontWeight: '500' },
  toggle: {
    width: 52, height: 28, borderRadius: 14,
    backgroundColor: COLORS.textMuted, padding: 2, justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.mint },
  toggleCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.white, elevation: 2 },
  toggleCircleActive: { alignSelf: 'flex-end' },
  controlRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 14, marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.lavenderLight,
  },
  controlRowActive: { backgroundColor: COLORS.lavenderLight, borderColor: COLORS.primary },
  controlIcon: { fontSize: 22, marginRight: 12 },
  controlLabel: { flex: 1, fontSize: 18, color: COLORS.text, fontWeight: '500' },
  controlLabelActive: { color: COLORS.primaryDark, fontWeight: '700' },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.textMuted, alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primaryDark },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primaryDark },
  resetBtn: {
    marginTop: 8, paddingVertical: 12, borderRadius: 12,
    backgroundColor: COLORS.red + '20', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.red + '40',
  },
  resetBtnText: { fontSize: 16, color: COLORS.red, fontWeight: '600' },
  helpCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 24,
    elevation: 2, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8,
  },
  helpText: { fontSize: 15, color: COLORS.textLight, lineHeight: 24 },
});
