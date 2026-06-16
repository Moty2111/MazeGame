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
      case 'current': return '🎯';
      case 'unlocked': return '🚩';
      case 'locked': return '🔒';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Выбрать уровень</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {LEVELS.map((level) => {
          const status = getStatus(level.id);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const progress = isCompleted ? 100 : status === 'current' ? 50 : 0;

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
              <View style={styles.levelNumberWrap}>
                <Text style={[styles.levelNumber, isLocked && styles.levelTextLocked]}>
                  {level.id + 1}
                </Text>
                <View style={[styles.progressBar, { width: 40 }]}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={{ fontSize: 18 }}>{statusEmoji(status)}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={[styles.levelName, isLocked && styles.levelTextLocked]}>
                  {level.name}
                </Text>
                <Text style={[styles.levelSubtitle, isLocked && styles.levelTextLocked]}>
                  {level.subtitle}
                </Text>
                <Text style={[styles.levelSize, isLocked && styles.levelTextLocked]}>
                  {level.rows}×{level.cols}
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
  header: { marginBottom: 20 },
  backBtn: { marginBottom: 12 },
  backBtnText: { fontSize: 22, color: COLORS.primaryDark, fontWeight: '600' },
  title: { fontSize: 32, color: COLORS.text, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24, gap: 8 },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    borderWidth: 2,
    borderColor: COLORS.lavenderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  levelCardCompleted: { borderColor: COLORS.mint, backgroundColor: COLORS.mintLight + '40' },
  levelCardCurrent: { borderColor: COLORS.primary, backgroundColor: COLORS.lavenderLight + '60' },
  levelCardLocked: { opacity: 0.45, backgroundColor: COLORS.bgDark },
  levelNumberWrap: { alignItems: 'center', marginRight: 16, gap: 4 },
  levelNumber: { fontSize: 28, color: COLORS.text, fontWeight: '700', width: 40, textAlign: 'center' },
  progressBar: { height: 3, backgroundColor: COLORS.textMuted, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.mint, borderRadius: 2 },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 20, color: COLORS.text, fontWeight: '600' },
  levelSubtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  levelSize: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  levelTextLocked: { color: COLORS.textMuted },
});
