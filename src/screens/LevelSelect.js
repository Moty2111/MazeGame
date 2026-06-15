import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, LEVELS } from '../constants';

export default function LevelSelect({ onBack, onSelectLevel, completedLevels, currentLevel }) {
  const isLevelUnlocked = (levelId) => {
    if (levelId === 0) return true;
    return completedLevels.includes(levelId - 1);
  };

  const getLevelStatus = (levelId) => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (levelId === currentLevel) return 'current';
    if (isLevelUnlocked(levelId)) return 'unlocked';
    return 'locked';
  };

  const getStatusEmoji = (status) => {
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {LEVELS.map((level, index) => {
          const status = getLevelStatus(level.id);
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
                <Text style={styles.statusEmoji}>{getStatusEmoji(status)}</Text>
              </View>

              <View style={styles.levelInfo}>
                <Text
                  style={[
                    styles.levelName,
                    isLocked && styles.levelTextLocked,
                  ]}
                >
                  {level.name}
                </Text>
                <Text
                  style={[
                    styles.levelSubtitle,
                    isLocked && styles.levelTextLocked,
                  ]}
                >
                  {level.subtitle} • {level.rows}×{level.cols}
                </Text>
              </View>

              {index < LEVELS.length - 1 && !isCompleted && (
                <View style={styles.connector} />
              )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardCompleted: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
  },
  levelCardCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lavender + '15',
  },
  levelCardLocked: {
    opacity: 0.5,
    backgroundColor: COLORS.bgDark,
  },
  levelHeader: {
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    width: 40,
    textAlign: 'center',
  },
  statusEmoji: {
    fontSize: 16,
    marginTop: 4,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  levelSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 2,
  },
  levelTextLocked: {
    color: COLORS.textLight,
  },
  connector: {
    display: 'none',
  },
});
