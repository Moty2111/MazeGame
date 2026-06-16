import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  useWindowDimensions,
  Vibration,
} from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { COLORS } from '../constants';
import { generateMaze } from '../mazeGenerator';
import Maze from '../components/Maze';

const TILT_THRESHOLD = 0.2;
const TILT_COOLDOWN = 120;

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

function DpadBtn({ dir, label, onMove }) {
  const timer = useRef(null);
  const handleIn = () => {
    onMove(dir);
    timer.current = setInterval(() => onMove(dir), 100);
  };
  const handleOut = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  };
  return (
    <TouchableOpacity
      style={styles.dpadBtn}
      onPressIn={handleIn}
      onPressOut={handleOut}
      activeOpacity={0.5}
    >
      <Text style={styles.dpadBtnText}>{label}</Text>
    </TouchableOpacity>
  );
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
  const settingsRef = useRef(settings);

  posRef.current = playerPos;
  mazeRef.current = maze;
  winRef.current = isWin;
  settingsRef.current = settings;

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
    DeviceMotion.isAvailableAsync()
      .then((avail) => {
        setTiltAvailable(avail);
        if (avail) DeviceMotion.setUpdateInterval(50);
      })
      .catch(() => setTiltAvailable(false));
  }, []);

  const doMove = useCallback((direction) => {
    if (winRef.current || !mazeRef.current) return;
    const newPos = tryMove(posRef.current, direction, mazeRef.current);
    if (newPos === posRef.current) return;
    setPlayerPos(newPos);
    setMoves((m) => m + 1);
    if (settingsRef.current.vibrationEnabled) {
      Vibration.vibrate(10);
    }
    if (newPos.row === level.rows - 1 && newPos.col === level.cols - 1) {
      setIsWin(true);
      if (settingsRef.current.vibrationEnabled) {
        Vibration.vibrate([0, 50, 30, 50], false);
      }
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

  const handleMove = useCallback((dir) => doMove(dir), [doMove]);
  const handleNext = () => onComplete(level.id, moves, time);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const cellSize = Math.floor((width - 48) / Math.max(level.cols, level.rows));
  const starScale = starAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.2] });

  const showDpad = settings.controlMode === 'buttons' || settings.controlMode === 'tilt';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <Text style={styles.levelTitle}>{level.name}</Text>
          <Text style={styles.levelSub}>Уровень {level.id + 1} • {level.rows}×{level.cols}</Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(time)}</Text>
        </View>
      </View>
      <View style={styles.movesRow}>
        <Text style={styles.movesText}>Ходов: {moves}</Text>
        {tiltAvailable && settings.controlMode === 'tilt' && (
          <Text style={styles.tiltBadge}>📱 Наклон</Text>
        )}
      </View>
      <Animated.View style={[styles.mazeContainer, { opacity: fadeAnim }]}>
        {maze && <Maze maze={maze} playerPos={playerPos} level={level} onMove={handleMove} cellSize={cellSize} />}
        {isWin && (
          <Animated.View style={[styles.winOverlay, { transform: [{ scale: starScale }] }]}>
            <Text style={{ fontSize: 72 }}>⭐</Text>
            <Text style={styles.winText}>Уровень пройден!</Text>
          </Animated.View>
        )}
      </Animated.View>
      {showComplete && (
        <View style={styles.completePanel}>
          <Text style={styles.completeTitle}>🎉 Уровень {level.id + 1} завершён!</Text>
          <Text style={styles.completeStats}>Ходов: {moves} • Время: {formatTime(time)}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>{level.id < 4 ? '→ Следующий уровень' : '🎊 Финальный уровень!'}</Text>
          </TouchableOpacity>
        </View>
      )}
      {!showComplete && (
        <View style={styles.controlsContainer}>
          {showDpad && (
            <View style={styles.dpad}>
              <View style={styles.dpadRow}>
                <View style={styles.dpadSpacer} />
                <DpadBtn dir="UP" label="↑" onMove={handleMove} />
                <View style={styles.dpadSpacer} />
              </View>
              <View style={styles.dpadRow}>
                <DpadBtn dir="LEFT" label="←" onMove={handleMove} />
                <View style={styles.dpadCenter}>
                  <Text style={{ fontSize: 22 }}>🐱</Text>
                </View>
                <DpadBtn dir="RIGHT" label="→" onMove={handleMove} />
              </View>
              <View style={styles.dpadRow}>
                <View style={styles.dpadSpacer} />
                <DpadBtn dir="DOWN" label="↓" onMove={handleMove} />
                <View style={styles.dpadSpacer} />
              </View>
            </View>
          )}
          <Text style={styles.swipeHint}>
            {settings.controlMode === 'swipe' ? '👆 Проведи по лабиринту' : '👆 Или проведи по лабиринту'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', elevation: 2, marginRight: 10 },
  backBtnText: { fontSize: 22, color: COLORS.primaryDark, fontWeight: '700' },
  topInfo: { flex: 1 },
  levelTitle: { fontSize: 20, color: COLORS.text, fontWeight: '700' },
  levelSub: { fontSize: 13, color: COLORS.textLight },
  timerBox: { backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, elevation: 2 },
  timerText: { fontSize: 18, color: COLORS.primaryDark, fontWeight: '700' },
  movesRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 4, gap: 8 },
  movesText: { fontSize: 14, color: COLORS.textLight },
  tiltBadge: { fontSize: 12, color: COLORS.primaryDark, backgroundColor: COLORS.lavenderLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  mazeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, position: 'relative' },
  winOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20 },
  winText: { fontSize: 24, color: COLORS.primaryDark, marginTop: 8, fontWeight: '700' },
  completePanel: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20, alignItems: 'center', backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 12 },
  completeTitle: { fontSize: 22, color: COLORS.text, marginBottom: 4, fontWeight: '700' },
  completeStats: { fontSize: 15, color: COLORS.textLight, marginBottom: 12 },
  nextBtn: { backgroundColor: COLORS.primaryDark, paddingVertical: 14, paddingHorizontal: 44, borderRadius: 30, elevation: 4, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8 },
  nextBtnText: { fontSize: 20, color: COLORS.white, fontWeight: '600' },
  controlsContainer: { paddingBottom: 16, paddingHorizontal: 24 },
  dpad: { alignItems: 'center', marginBottom: 6 },
  dpadRow: { flexDirection: 'row', gap: 4 },
  dpadBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', elevation: 3, borderWidth: 1.5, borderColor: COLORS.lavenderLight, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6 },
  dpadSpacer: { width: 56, height: 56 },
  dpadCenter: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.lavenderLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '40' },
  dpadBtnText: { fontSize: 26, color: COLORS.primaryDark, fontWeight: '700' },
  swipeHint: { textAlign: 'center', fontSize: 13, color: COLORS.textMuted, marginTop: 8 },
});
