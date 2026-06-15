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

const CONFETTI_COLORS = ['#D8B4FE', '#86EFAC', '#FDE68A', '#FCA5A5', '#93C5FD', '#FDBA74', '#C4B5D4', '#FBBF24'];

function ConfettiPiece({ delay, duration, color, side, height }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-50, height] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [side * 50, side * 30, side * 80] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${side * 360}deg`] });
  const opacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 10, height: 10, borderRadius: 2,
        top: -20, left: '50%',
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
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1000,
      duration: 2000 + Math.random() * 3000,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      side: Math.random() > 0.5 ? 1 : -1,
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
        <ConfettiPiece key={c.id} delay={c.delay} duration={c.duration} color={c.color} side={c.side} height={height} />
      ))}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.title}>🎉 С Днём Рождения,</Text>
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
        <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.8}>
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
  title: { fontSize: 32, color: COLORS.text, textAlign: 'center' },
  titleName: { fontSize: 52, color: COLORS.primaryDark, textAlign: 'center', marginTop: -4 },
  divider: { width: 120, height: 2, backgroundColor: COLORS.primary, opacity: 0.3, marginBottom: 20 },
  message: { fontSize: 18, color: COLORS.text, textAlign: 'center', lineHeight: 28, marginBottom: 24 },
  statsCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20,
    marginBottom: 24, width: '100%', elevation: 2,
  },
  statsTitle: { fontSize: 18, color: COLORS.text, marginBottom: 8 },
  statsText: { fontSize: 16, color: COLORS.textLight, marginBottom: 4 },
  restartBtn: {
    backgroundColor: COLORS.lavender, paddingVertical: 16, paddingHorizontal: 48,
    borderRadius: 50, elevation: 4,
    shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  restartBtnText: { fontSize: 22, color: COLORS.white },
});
