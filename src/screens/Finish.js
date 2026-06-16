import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants';

const CONFETTI_COLORS = ['#C084FC', '#6EE7A0', '#FDE68A', '#FCA5A5', '#93C5FD', '#FDBA74', '#DDD6FE', '#FBBF24', '#A78BFA', '#34D399'];

function ConfettiPiece({ delay, duration, color, side, height, startX }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-40, height + 40] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, side * 40, side * 100] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${side * 720}deg`] });
  const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        width: 8,
        height: 12,
        borderRadius: 2,
        top: -20,
        backgroundColor: color,
        transform: [{ translateY }, { translateX }, { rotate }],
        opacity,
      }}
    />
  );
}

export default function Finish({ onRestart, levelResults }) {
  const { width, height } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [confetti] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2000,
      duration: 2500 + Math.random() * 4000,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      side: Math.random() > 0.5 ? 1 : -1,
      startX: Math.random() * width,
    }))
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 2, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalMoves = levelResults.reduce((s, r) => s + r.moves, 0);
  const totalTime = levelResults.reduce((s, r) => s + r.time, 0);
  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  const catScale = bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.finishBg} />
      {confetti.map((c) => (
        <ConfettiPiece key={c.id} delay={c.delay} duration={c.duration} color={c.color} side={c.side} height={height} startX={c.startX} />
      ))}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.greeting}>🎉</Text>
          <Text style={styles.title}>С Днём Рождения,</Text>
          <Text style={styles.titleName}>КАТЯ!</Text>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: catScale }] }}>
          <Text style={{ fontSize: 80, marginVertical: 16 }}>🐱🎂</Text>
        </Animated.View>
        <View style={styles.divider} />
        <Text style={styles.message}>
          Пусть каждый день будет таким же{'\n'}ярким и радостным, как этот{'\n'}лабиринт приключений!
        </Text>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Статистика</Text>
          <Text style={styles.statsText}>Уровней пройдено: {levelResults.length} из 5</Text>
          <Text style={styles.statsText}>Всего ходов: {totalMoves}</Text>
          <Text style={styles.statsText}>Общее время: {formatTime(totalTime)}</Text>
        </View>
        <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.85}>
          <Text style={styles.restartBtnText}>🔄 Пройти заново</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.finishBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: { alignItems: 'center', paddingHorizontal: 32, zIndex: 10 },
  greeting: { fontSize: 48, textAlign: 'center', marginBottom: 4 },
  title: { fontSize: 30, color: COLORS.text, textAlign: 'center', fontWeight: '700' },
  titleName: { fontSize: 56, color: COLORS.primaryDark, textAlign: 'center', marginTop: -4, fontWeight: '800' },
  divider: { width: 100, height: 2, backgroundColor: COLORS.primary, opacity: 0.2, marginBottom: 20 },
  message: { fontSize: 17, color: COLORS.text, textAlign: 'center', lineHeight: 26, marginBottom: 24 },
  statsCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    marginBottom: 24, width: '100%', elevation: 3,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 10,
    borderWidth: 1, borderColor: COLORS.goldLight,
  },
  statsTitle: { fontSize: 18, color: COLORS.text, marginBottom: 8, fontWeight: '600' },
  statsText: { fontSize: 15, color: COLORS.textLight, marginBottom: 4 },
  restartBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 16,
    paddingHorizontal: 52,
    borderRadius: 50,
    elevation: 5,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  restartBtnText: { fontSize: 22, color: COLORS.white, fontWeight: '600' },
});
