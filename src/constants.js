export const COLORS = {
  bg: '#FFF8F0',
  bgDark: '#F5EDE0',
  primary: '#D8B4FE',
  primaryDark: '#A78BFA',
  secondary: '#86EFAC',
  secondaryDark: '#6EE7A0',
  text: '#4A4A4A',
  textLight: '#9CA3AF',
  wall: '#C4B5D4',
  wallDark: '#A78BFA',
  accent: '#FDE68A',
  cream: '#FFF5EE',
  white: '#FFFFFF',
  red: '#FCA5A5',
  lavender: '#D8B4FE',
  mint: '#86EFAC',
  gold: '#FCD34D',
  finishBg: '#FEF3C7',
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
