import React, { useRef, useEffect } from 'react';
import { View, PanResponder, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../constants';

const SWIPE_THRESHOLD = 10;

function Maze({ maze, playerPos, level, onMove, cellSize: propCellSize }) {
  const { width: screenWidth } = useWindowDimensions();
  const padding = 20;
  const avail = screenWidth - padding * 2;
  const cs = propCellSize || Math.floor(avail / Math.max(level.cols, level.rows));
  const mw = cs * level.cols;
  const mh = cs * level.rows;

  const ref = useRef(onMove);
  useEffect(() => { ref.current = onMove; }, [onMove]);
  const last = useRef({ x: 0, y: 0 });

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gs) => { last.current = { x: gs.x0, y: gs.y0 }; },
    onPanResponderRelease: (_, gs) => {
      const dx = gs.moveX - last.current.x;
      const dy = gs.moveY - last.current.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) ref.current(dx > 0 ? 'RIGHT' : 'LEFT');
      else ref.current(dy > 0 ? 'DOWN' : 'UP');
      last.current = { x: gs.moveX, y: gs.moveY };
    },
  })).current;

  const walls = [];
  if (maze) {
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        const cell = maze[r][c];
        const j = cell.jitter || {};
        for (const wk of ['top', 'bottom', 'left', 'right']) {
          if (!cell[wk]) continue;
          const jt = j[wk] || { x1: 0, y1: 0, x2: 0, y2: 0 };
          let x1, y1, x2, y2;
          const wallColor = COLORS.wallLight;
          const wallWidth = 2.5;
          switch (wk) {
            case 'top':
              x1 = c * cs + jt.x1; y1 = r * cs + jt.y1; x2 = (c + 1) * cs + jt.x2; y2 = r * cs + jt.y2;
              walls.push(<Line key={`t${r}_${c}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wallColor} strokeWidth={wallWidth} strokeLinecap="round" />);
              break;
            case 'bottom':
              x1 = c * cs + jt.x1; y1 = (r + 1) * cs + jt.y1; x2 = (c + 1) * cs + jt.x2; y2 = (r + 1) * cs + jt.y2;
              walls.push(<Line key={`b${r}_${c}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wallColor} strokeWidth={wallWidth} strokeLinecap="round" />);
              break;
            case 'left':
              x1 = c * cs + jt.x1; y1 = r * cs + jt.y1; x2 = c * cs + jt.x2; y2 = (r + 1) * cs + jt.y2;
              walls.push(<Line key={`l${r}_${c}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wallColor} strokeWidth={wallWidth} strokeLinecap="round" />);
              break;
            case 'right':
              x1 = (c + 1) * cs + jt.x1; y1 = r * cs + jt.y1; x2 = (c + 1) * cs + jt.x2; y2 = (r + 1) * cs + jt.y2;
              walls.push(<Line key={`r${r}_${c}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wallColor} strokeWidth={wallWidth} strokeLinecap="round" />);
              break;
          }
        }
      }
    }
  }

  const gx = (level.cols - 1) * cs + cs / 2;
  const gy = (level.rows - 1) * cs + cs / 2;
  const px = playerPos.col * cs + cs / 2;
  const py = playerPos.row * cs + cs / 2;
  const isWin = playerPos.row === level.rows - 1 && playerPos.col === level.cols - 1;

  return (
    <View style={[styles.box, { width: mw, height: mh }]} {...pan.panHandlers}>
      <Svg width={mw} height={mh} viewBox={`0 0 ${mw} ${mh}`}>
        {walls}
        <Circle cx={gx} cy={gy} r={cs * 0.35} fill={COLORS.goldLight} opacity={0.5} />
        <SvgText x={gx} y={gy} fontSize={cs * 0.45} textAnchor="middle" dy={cs * 0.08}>🎁</SvgText>
        <Circle cx={px} cy={py} r={cs * 0.35} fill={COLORS.lavenderLight} opacity={0.4} />
        <SvgText x={px} y={py} fontSize={cs * 0.5} textAnchor="middle" dy={cs * 0.08}>🐱</SvgText>
        {isWin && (
          <>
            <Circle cx={gx} cy={gy} r={cs * 0.45} fill="none" stroke={COLORS.gold} strokeWidth={3} strokeDasharray="6,4" opacity={0.8} />
            <Circle cx={gx} cy={gy} r={cs * 0.55} fill="none" stroke={COLORS.goldLight} strokeWidth={2} strokeDasharray="4,6" opacity={0.5} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: COLORS.lavenderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});

export default Maze;
