import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS } from '../constants';

const { width, height } = Dimensions.get('window');

export default function MainMenu({ onPlay, onSettings, onAbout }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      tension: 60,
      delay: 200,
      useNativeDriver: true,
    }).start();

    Animated.stagger(150, [
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const catBounce = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

  const btnScale = btnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <Animated.View style={[styles.decorTopLeft]}>
        <Text style={styles.decorText}>✦</Text>
      </Animated.View>
      <Animated.View style={[styles.decorTopRight]}>
        <Text style={styles.decorText}>✧</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ translateY: catBounce }] }}>
          <Text style={styles.catEmoji}>🐱</Text>
        </Animated.View>

        <Text style={styles.title}>Лабиринт</Text>
        <Text style={styles.subtitle}>для Кати</Text>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerStar}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.hintText}>Найди путь к подарку 🎁</Text>

        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlay}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>🎮 Играть</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>⚙️ Настройки</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onAbout}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>👤 Об игре</Text>
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
  content: {
    alignItems: 'center',
    width: '100%',
  },
  decorTopLeft: {
    position: 'absolute',
    top: 60,
    left: 30,
  },
  decorTopRight: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  decorText: {
    fontSize: 28,
    color: COLORS.primary,
    opacity: 0.5,
  },
  catEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 48,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: COLORS.primaryDark,
    marginTop: -8,
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: 200,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  dividerStar: {
    fontSize: 14,
    color: COLORS.primaryDark,
    marginHorizontal: 8,
  },
  hintText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  playButton: {
    backgroundColor: COLORS.lavender,
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 50,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
  },
  playButtonText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    letterSpacing: 1,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  versionText: {
    position: 'absolute',
    bottom: 24,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});
