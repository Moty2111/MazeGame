import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants';

function Sparkle({ delay, left, size }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2000, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 1, 0.2] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 1.2, 0.8] });
  return (
    <Animated.Text style={{ position: 'absolute', left, top: undefined, fontSize: size, opacity, transform: [{ scale }] }}>
      ✦
    </Animated.Text>
  );
}

export default function MainMenu({ onPlay, onSettings, onAbout }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.spring(bounceAnim, { toValue: 1, friction: 3, tension: 60, delay: 200, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const catBounce = bounceAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -24, 0] });
  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <Sparkle left={width * 0.12} delay={0} size={16} />
      <Sparkle left={width * 0.82} delay={500} size={20} />
      <Sparkle left={width * 0.5} delay={1000} size={12} />
      <View style={styles.topDecor}>
        <View style={[styles.decorLine, { left: 0 }]} />
        <Text style={styles.decorStar}>✦ ✦ ✦</Text>
        <View style={[styles.decorLine, { right: 0 }]} />
      </View>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ translateY: catBounce }] }}>
          <View style={styles.catCircle}>
            <Text style={styles.catEmoji}>🐱</Text>
          </View>
        </Animated.View>
        <Text style={styles.title}>Лабиринт</Text>
        <Text style={styles.subtitle}>для Кати</Text>
        <Text style={styles.hintText}>Найди путь к подарку 🎁</Text>
        <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
          <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.85}>
            <Text style={styles.playButtonText}>🎮 Играть</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.secondaryButtons}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onSettings} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnIcon}>⚙️</Text>
            <Text style={styles.secondaryBtnText}>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onAbout} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnIcon}>👤</Text>
            <Text style={styles.secondaryBtnText}>Об игре</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Text style={styles.versionText}>v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  topDecor: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  decorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  decorStar: {
    fontSize: 12,
    color: COLORS.primaryDark,
    letterSpacing: 6,
    marginHorizontal: 12,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  catCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lavenderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  catEmoji: { fontSize: 48 },
  title: {
    fontSize: 48,
    color: COLORS.text,
    letterSpacing: 3,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 36,
    color: COLORS.primaryDark,
    marginTop: -8,
    marginBottom: 12,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 28,
  },
  playButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 50,
    elevation: 6,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 20,
  },
  playButtonText: {
    fontSize: 24,
    color: COLORS.white,
    letterSpacing: 1,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: COLORS.lavenderLight,
    elevation: 2,
    gap: 6,
  },
  secondaryBtnIcon: { fontSize: 16 },
  secondaryBtnText: { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  versionText: {
    position: 'absolute',
    bottom: 24,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
