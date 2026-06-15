import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import { COLORS } from '../constants';
import { generateMaze } from '../mazeGenerator';
import Maze from '../components/Maze';

const TILT_THRESHOLD = 0.5;
const TILT_COOLDOWN = 300;

function tryMove(playerPos, direction, grid) {
  const { row, col } = playerPos;
  if (!grid || !grid[row] || !grid[row][col]) return playerPos;
  switch (direction) {
    case 'UP':
      if (!grid[row][col].top && row > 0) return { row: row - 1, col };
      break;
    case 'DOWN':
      if (!grid[row][col].bottom && row < grid.length - 1) return { row: row + 1, col };
      break;
    case 'LEFT':
      if (!grid[row][col].left && col > 0) return { row, col: col - 1 };
      break;
    case 'RIGHT':
      if (!grid[row][col].right && col < grid[0].length - 1) return { row, col: col + 1 };
      break;
  }
  return playerPos;
}

export default function Game({ level, onComplete, onBack, settings }) {
  const { width } = useWindowDimensions();
  const [maze, setMaze] = useState(null);
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [tiltAvailable, setTiltAvailable] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const lastTiltTime = useRef(0);
  const subRef = useRef(null);
  const posRef = useRef(playerPos);
  const mazeRef = useRef(maze);
  const winRef = useRef(isWin);
  const soundRef = useRef(null);

  posRef.current = playerPos;
  mazeRef.current = maze;
  winRef.current = isWin;

  useEffect(() => {
    const g = generateMaze(level.rows, level.cols);
    setMaze(g);
    setPlayerPos({ row: 0, col: 0 });
    setMoves(0);
    setTime(0);
    setIsWin(false);
    setShowComplete(false);
    fadeAnim.setValue(0);
    starAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [level]);

  useEffect(() => {
    if (isWin) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isWin]);

  useEffect(() => {
    DeviceMotion.isAvailableAsync().then(setTiltAvailable).catch(() => setTiltAvailable(false));
  }, []);

  const doMove = useCallback((direction) => {
    if (winRef.current || !mazeRef.current) return;
    const newPos = tryMove(posRef.current, direction, mazeRef.current);
    if (newPos === posRef.current) return;
    setPlayerPos(newPos);
    setMoves((m) => m + 1);
    if (newPos.row === level.rows - 1 && newPos.col === level.cols - 1) {
      setIsWin(true);
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.delay(800),
      ]).start(() => setShowComplete(true));
    }
  }, [level, starAnim]);

  useEffect(() => {
    if (settings.controlMode !== 'tilt' || !tiltAvailable) {
      if (subRef.current) { subRef.current.remove(); subRef.current = null; }
      return;
    }
    subRef.current = DeviceMotion.addListener((data) => {
      const now = Date.now();
      if (now - lastTiltTime.current < TILT_COOLDOWN) return;
      const { accelerationIncludingGravity } = data;
      if (!accelerationIncludingGravity) return;
      const { x, y } = accelerationIncludingGravity;
      let dir = null;
      if (Math.abs(x) > TILT_THRESHOLD || Math.abs(y) > TILT_THRESHOLD) {
        if (Math.abs(x) > Math.abs(y)) dir = x > 0 ? 'RIGHT' : 'LEFT';
        else dir = y > 0 ? 'DOWN' : 'UP';
      }
      if (dir) { lastTiltTime.current = now; doMove(dir); }
    });
    return () => { if (subRef.current) { subRef.current.remove(); subRef.current = null; } };
  }, [settings.controlMode, tiltAvailable, doMove]);

  useEffect(() => {
    let cancelled = false;
    async function loadAudio() {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/bgmusic.mp3'),
          { isLooping: true, volume: settings.volume }
        );
        if (cancelled) { await sound.unloadAsync().catch(() => {}); return; }
        soundRef.current = sound;
        if (settings.soundEnabled) await sound.playAsync();
      } catch (_) {}
    }
    loadAudio();
    return () => {
      cancelled = true;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [level, settings.soundEnabled, settings.volume]);

  const handleMove = useCallback((dir) => doMove(dir), [doMove]);
  const handleNext = () => onComplete(level.id, moves, time);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const cellSize = Math.floor((width - 48) / Math.max(level.cols, level.rows));
  const starScale = starAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.2] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <Text style={styles.levelTitle}>{level.name}</Text>
          <Text style={styles.levelSub}>Уровень {level.id + 1} • {level.rows}×{level.cols}</Text>
        </View>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
      </View>
      <Animated.View style={[styles.mazeContainer, { opacity: fadeAnim }]}>
        {maze && <Maze maze={maze} playerPos={playerPos} level={level} onMove={handleMove} cellSize={cellSize} />}
        {isWin && (
          <Animated.View style={[styles.winOverlay, { transform: [{ scale: starScale }] }]}>
            <Text style={{ fontSize: 64 }}>⭐</Text>
            <Text style={styles.winText}>Уровень пройден!</Text>
          </Animated.View>
        )}
      </Animated.View>
      {showComplete && (
        <View style={styles.completePanel}>
          <Text style={styles.completeTitle}>🎉 Уровень {level.id + 1} завершён!</Text>
          <Text style={styles.completeStats}>Ходов: {moves} • Время: {formatTime(time)}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>{level.id < 4 ? '→ Следующий уровень' : '🎊 Финальный уровень!'}</Text>
          </TouchableOpacity>
        </View>
      )}
      {!showComplete && (
        <View style={styles.controlsContainer}>
          <View style={styles.dpad}>
            <View style={styles.dpadRow}>
              <View style={[styles.dpadBtn, styles.dpadPlaceholder]} />
              <TouchableOpacity style={styles.dpadBtn} onPress={() => handleMove('UP')} activeOpacity={0.6}>
                <Text style={styles.dpadBtnText}>↑</Text>
              </TouchableOpacity>
              <View style={[styles.dpadBtn, styles.dpadPlaceholder]} />
            </View>
            <View style={styles.dpadRow}>
              <TouchableOpacity style={styles.dpadBtn} onPress={() => handleMove('LEFT')} activeOpacity={0.6}>
                <Text style={styles.dpadBtnText}>←</Text>
              </TouchableOpacity>
              <View style={[styles.dpadBtn, styles.dpadCenter]}>
                <Text style={{ fontSize: 24 }}>🐱</Text>
              </View>
              <TouchableOpacity style={styles.dpadBtn} onPress={() => handleMove('RIGHT')} activeOpacity={0.6}>
                <Text style={styles.dpadBtnText}>→</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dpadRow}>
              <View style={[styles.dpadBtn, styles.dpadPlaceholder]} />
              <TouchableOpacity style={styles.dpadBtn} onPress={() => handleMove('DOWN')} activeOpacity={0.6}>
                <Text style={styles.dpadBtnText}>↓</Text>
              </TouchableOpacity>
              <View style={[styles.dpadBtn, styles.dpadPlaceholder]} />
            </View>
          </View>
          <Text style={styles.swipeHint}>👆 Проведи по лабиринту или нажми стрелки</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  backText: { fontSize: 28, color: COLORS.primaryDark, marginRight: 12 },
  topInfo: { flex: 1 },
  levelTitle: { fontSize: 20, color: COLORS.text },
  levelSub: { fontSize: 14, color: COLORS.textLight },
  timerText: { fontSize: 18, color: COLORS.primaryDark },
  mazeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, position: 'relative' },
  winOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16,
  },
  winText: { fontSize: 24, color: COLORS.primaryDark, marginTop: 8 },
  completePanel: { paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  completeTitle: { fontSize: 22, color: COLORS.text, marginBottom: 4 },
  completeStats: { fontSize: 16, color: COLORS.textLight, marginBottom: 12 },
  nextBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 30, elevation: 3,
    shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  nextBtnText: { fontSize: 20, color: COLORS.white },
  controlsContainer: { paddingBottom: 16 },
  dpad: { alignItems: 'center', marginBottom: 8 },
  dpadRow: { flexDirection: 'row', gap: 4 },
  dpadBtn: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    elevation: 2, borderWidth: 1, borderColor: COLORS.lavender + '40',
  },
  dpadPlaceholder: { backgroundColor: 'transparent', elevation: 0, borderWidth: 0 },
  dpadCenter: { backgroundColor: COLORS.lavender + '30', borderColor: COLORS.primary },
  dpadBtnText: { fontSize: 24, color: COLORS.primaryDark },
  swipeHint: { textAlign: 'center', fontSize: 14, color: COLORS.textLight },
});
