import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, CONTROL_MODES } from '../constants';

export default function Settings({ onBack, settings, onUpdateSettings }) {
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [volume, setVolume] = useState(settings.volume);
  const [controlMode, setControlMode] = useState(settings.controlMode);

  const handleSoundToggle = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    onUpdateSettings({ ...settings, soundEnabled: newVal });
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    onUpdateSettings({ ...settings, volume: newVolume });
  };

  const handleControlMode = (mode) => {
    setControlMode(mode);
    onUpdateSettings({ ...settings, controlMode: mode });
  };

  const VOLUME_LEVELS = [
    { label: 'Выкл', value: 0 },
    { label: 'Тихо', value: 0.3 },
    { label: 'Средне', value: 0.6 },
    { label: 'Громко', value: 1 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backBtnText}>← Назад</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Настройки</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔊 Звук</Text>
        <TouchableOpacity style={styles.toggleRow} onPress={handleSoundToggle}>
          <Text style={styles.toggleLabel}>Музыка</Text>
          <View style={[styles.toggle, soundEnabled && styles.toggleActive]}>
            <View style={[styles.toggleCircle, soundEnabled && styles.toggleCircleActive]} />
          </View>
        </TouchableOpacity>

        <Text style={styles.volumeLabel}>Громкость</Text>
        <View style={styles.volumeRow}>
          {VOLUME_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.volumeBtn,
                volume === level.value && styles.volumeBtnActive,
              ]}
              onPress={() => handleVolumeChange(level.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.volumeBtnText,
                  volume === level.value && styles.volumeBtnTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Управление</Text>
        {CONTROL_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.controlRow,
              controlMode === mode.id && styles.controlRowActive,
            ]}
            onPress={() => handleControlMode(mode.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>{mode.icon}</Text>
            <Text
              style={[
                styles.controlLabel,
                controlMode === mode.id && styles.controlLabelActive,
              ]}
            >
              {mode.label}
            </Text>
            <View
              style={[
                styles.radio,
                controlMode === mode.id && styles.radioActive,
              ]}
            >
              {controlMode === mode.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        💡 Свайпы — проведи по лабиринту{'\n'}
        🔘 Кнопки — нажми стрелки{'\n'}
        📱 Наклон — поверни телефон
      </Text>
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
  backBtn: {
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.primaryDark,
  },
  title: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 24,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.textLight,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.secondary,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  volumeLabel: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  volumeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bgDark,
  },
  volumeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  volumeBtnText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  volumeBtnTextActive: {
    color: COLORS.white,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.bgDark,
  },
  controlRowActive: {
    backgroundColor: COLORS.lavender + '20',
    borderColor: COLORS.primary,
  },
  controlIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  controlLabel: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  controlLabelActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primaryDark,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.primaryDark,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryDark,
  },
  hint: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 8,
    lineHeight: 22,
  },
});
