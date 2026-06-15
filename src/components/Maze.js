import React, { useRef, useCallback, useEffect } from 'react';
import { View, PanResponder, Dimensions, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../constants';

const SWIPE_THRESHOLD = 10;

function Maze({ maze, playerPos, level, onMove, cellSize: propCellSize }) {
  const screenWidth = Dimensions.get('window').width;
  const padding = 24;
  const availableWidth = screenWidth - padding * 2;
  const rows = level.rows;
  const cols = level.cols;
  const cellSize = propCellSize || Math.floor(availableWidth / Math.max(cols, rows));
  const mazeWidth = cellSize * cols;
  const mazeHeight = cellSize * rows;

  const onMoveRef = useRef(onMove);
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const lastGesture = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        lastGesture.current = { x: gs.x0, y: gs.y0 };
      },
      onPanResponderRelease: (_, gs) => {
        const dx = gs.moveX - lastGesture.current.x;
        const dy = gs.moveY - lastGesture.current.y;
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

        let dir;
        if (Math.abs(dx) > Math.abs(dy)) {
          dir = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
          dir = dy > 0 ? 'DOWN' : 'UP';
        }
        onMoveRef.current(dir);
        lastGesture.current = { x: gs.moveX, y: gs.moveY };
      },
    })
  ).current;

  const getWall = (row, col, wall) => {
    const cs = cellSize;
    const j = maze?.[row]?.[col]?.jitter?.[wall] || { x1: 0, y1: 0, x2: 0, y2: 0 };
    switch (wall) {
      case 'top':
        return { x1: col * cs + j.x1, y1: row * cs + j.y1, x2: (col + 1) * cs + j.x2, y2: row * cs + j.y2 };
      case 'bottom':
        return { x1: col * cs + j.x1, y1: (row + 1) * cs + j.y1, x2: (col + 1) * cs + j.x2, y2: (row + 1) * cs + j.y2 };
      case 'left':
        return { x1: col * cs + j.x1, y1: row * cs + j.y1, x2: col * cs + j.x2, y2: (row + 1) * cs + j.y2 };
      case 'right':
        return { x1: (col + 1) * cs + j.x1, y1: row * cs + j.y1, x2: (col + 1) * cs + j.x2, y2: (row + 1) * cs + j.y2 };
      default:
        return { x1: 0, y1: 0, x2: 0, y2: 0 };
    }
  };

  const walls = [];
  if (maze) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = maze[r][c];
        const wallKeys = ['top', 'bottom', 'left', 'right'];
        for (const wk of wallKeys) {
          if (cell[wk]) {
            const p = getWall(r, c, wk);
            walls.push(
              <Line
                key={`${wk[0]}${r}_${c}`}
                x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                stroke={COLORS.wall}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          }
        }
      }
    }
  }

  const goalX = (cols - 1) * cellSize + cellSize / 2;
  const goalY = (rows - 1) * cellSize + cellSize / 2;

  const px = playerPos.col * cellSize + cellSize / 2;
  const py = playerPos.row * cellSize + cellSize / 2;
  const catSize = cellSize * 0.55;

  const isWin = playerPos.row === rows - 1 && playerPos.col === cols - 1;

  return (
    <View style={[styles.container, { width: mazeWidth, height: mazeHeight }]} {...panResponder.panHandlers}>
      <Svg width={mazeWidth} height={mazeHeight} viewBox={`0 0 ${mazeWidth} ${mazeHeight}`}>
        {walls}

        <SvgText
          x={goalX} y={goalY} fontSize={cellSize * 0.5}
          textAnchor="middle" dy={cellSize * 0.08}
        >
          🎁
        </SvgText>

        <SvgText
          x={px} y={py} fontSize={catSize}
          textAnchor="middle" dy={catSize * 0.08}
        >
          🐱
        </SvgText>

        {isWin && (
          <Circle
            cx={goalX} cy={goalY} r={cellSize * 0.4}
            fill="none" stroke={COLORS.gold} strokeWidth={3}
            strokeDasharray="6,4" opacity={0.7}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignSelf: 'center',
  },
});

export default Maze;
