export const COLORS = {
  bg: '#FFF8F0',
  bgDark: '#F5EDE0',
  bgCard: '#FFFFFF',
  primary: '#C084FC',
  primaryDark: '#7C3AED',
  secondary: '#6EE7A0',
  secondaryDark: '#34D399',
  text: '#374151',
  textLight: '#9CA3AF',
  textMuted: '#D1D5DB',
  wall: '#A78BFA',
  wallLight: '#DDD6FE',
  accent: '#FDE68A',
  cream: '#FFFBEB',
  white: '#FFFFFF',
  red: '#FCA5A5',
  lavender: '#C084FC',
  lavenderLight: '#EDE9FE',
  mint: '#6EE7A0',
  mintLight: '#D1FAE5',
  gold: '#FBBF24',
  goldLight: '#FEF3C7',
  finishBg: '#FFFBEB',
  overlay: 'rgba(0,0,0,0.3)',
  shadow: 'rgba(124,58,237,0.12)',
};

export const LEVELS = [
  { id: 0, name: 'Первые шаги', subtitle: 'С чего всё начинается', rows: 3, cols: 3 },
  { id: 1, name: 'Тайная тропа', subtitle: 'Чуть сложнее', rows: 5, cols: 5 },
  { id: 2, name: 'Запутанный сад', subtitle: 'Пора задуматься', rows: 7, cols: 7 },
  { id: 3, name: 'Волшебный лес', subtitle: 'Испытание', rows: 9, cols: 9 },
  { id: 4, name: 'Сердце лабиринта', subtitle: 'Финал', rows: 11, cols: 11 },
];

export const CONTROL_MODES = [
  { id: 'swipe', label: 'Свайпы', icon: '👆' },
  { id: 'buttons', label: 'Кнопки', icon: '🔘' },
  { id: 'tilt', label: 'Наклон', icon: '📱' },
];
