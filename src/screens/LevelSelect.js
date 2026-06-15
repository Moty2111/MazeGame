import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS, LEVELS } from '../constants';

export default function LevelSelect({ onBack, onSelectLevel, completedLevels, currentLevel }) {
  const getStatus = (levelId) => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (levelId === currentLevel) return 'current';
    if (levelId === 0 || completedLevels.includes(levelId - 1)) return 'unlocked';
    return 'locked';
  };

  const statusEmoji = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '▶️';
      case 'unlocked': return '🚩';
      case 'locked': return '🔒';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backBtnText}>← Назад</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Выбрать уровень</Text>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {LEVELS.map((level) => {
          const status = getStatus(level.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                isCompleted && styles.levelCardCompleted,
                status === 'current' && styles.levelCardCurrent,
                isLocked && styles.levelCardLocked,
              ]}
              onPress={() => !isLocked && onSelectLevel(level)}
              activeOpacity={isLocked ? 1 : 0.7}
              disabled={isLocked}
            >
              <View style={styles.levelHeader}>
                <Text style={styles.levelNumber}>{level.id + 1}</Text>
                <Text style={{ fontSize: 16, marginTop: 4 }}>{statusEmoji(status)}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={[styles.levelName, isLocked && styles.levelTextLocked]}>
                  {level.name}
                </Text>
                <Text style={[styles.levelSubtitle, isLocked && styles.levelTextLocked]}>
                  {level.subtitle} • {level.rows}×{level.cols}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  title: { fontSize: 36, color: COLORS.text, marginBottom: 24 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardCompleted: { borderColor: COLORS.secondary },
  levelCardCurrent: { borderColor: COLORS.primary, backgroundColor: COLORS.lavender + '15' },
  levelCardLocked: { opacity: 0.5, backgroundColor: COLORS.bgDark },
  levelHeader: { alignItems: 'center', marginRight: 16 },
  levelNumber: { fontSize: 28, color: COLORS.text, width: 40, textAlign: 'center' },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 20, color: COLORS.text },
  levelSubtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  levelTextLocked: { color: COLORS.textLight },
});
