import 'react-native-gesture-handler';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { COLORS } from './src/constants';
import { LEVELS } from './src/constants';
import MainMenu from './src/screens/MainMenu';
import Settings from './src/screens/Settings';
import About from './src/screens/About';
import LevelSelect from './src/screens/LevelSelect';
import Game from './src/screens/Game';
import Finish from './src/screens/Finish';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😿</Text>
          <Text style={styles.errorText}>Что-то пошло не так...</Text>
          <Text style={styles.errorSub}>Перезапусти приложение</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({
    Caveat_400Regular,
    Caveat_700Bold,
  });

  const [screen, setScreen] = useState('mainMenu');
  const [settings, setSettings] = useState({
    soundEnabled: true,
    volume: 0.6,
    controlMode: 'swipe',
  });
  const [completedLevels, setCompletedLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levelResults, setLevelResults] = useState([]);

  const handlePlay = useCallback(() => setScreen('levelSelect'), []);
  const handleSettings = useCallback(() => setScreen('settings'), []);
  const handleAbout = useCallback(() => setScreen('about'), []);

  const handleBack = useCallback(() => {
    if (screen === 'settings' || screen === 'about') setScreen('mainMenu');
    else if (screen === 'levelSelect') setScreen('mainMenu');
    else if (screen === 'game') setScreen('levelSelect');
  }, [screen]);

  const handleSelectLevel = useCallback((level) => {
    setCurrentLevel(level);
    setScreen('game');
  }, []);

  const handleLevelComplete = useCallback(
    (levelId, moves, time) => {
      const newCompleted = completedLevels.includes(levelId)
        ? completedLevels
        : [...completedLevels, levelId];
      setCompletedLevels(newCompleted);
      setLevelResults((prev) => [...prev, { levelId, moves, time }]);
      if (levelId < LEVELS.length - 1) {
        setCurrentLevel(LEVELS[levelId + 1]);
        setScreen('game');
      } else {
        setScreen('finish');
      }
    },
    [completedLevels]
  );

  const handleRestart = useCallback(() => {
    setCompletedLevels([]);
    setCurrentLevel(null);
    setLevelResults([]);
    setScreen('mainMenu');
  }, []);

  const handleUpdateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingEmoji}>🐱</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  switch (screen) {
    case 'mainMenu':
      return <MainMenu onPlay={handlePlay} onSettings={handleSettings} onAbout={handleAbout} />;
    case 'settings':
      return <Settings settings={settings} onUpdateSettings={handleUpdateSettings} onBack={handleBack} />;
    case 'about':
      return <About onBack={handleBack} />;
    case 'levelSelect':
      return (
        <LevelSelect
          onBack={handleBack}
          onSelectLevel={handleSelectLevel}
          completedLevels={completedLevels}
          currentLevel={currentLevel ? currentLevel.id : 0}
        />
      );
    case 'game':
      return <Game level={currentLevel || LEVELS[0]} onComplete={handleLevelComplete} onBack={handleBack} settings={settings} />;
    case 'finish':
      return <Finish onRestart={handleRestart} levelResults={levelResults} />;
    default:
      return <MainMenu onPlay={handlePlay} onSettings={handleSettings} onAbout={handleAbout} />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Caveat_400Regular',
    color: COLORS.textLight,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 22,
    fontFamily: 'Caveat_700Bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  errorSub: {
    fontSize: 16,
    fontFamily: 'Caveat_400Regular',
    color: COLORS.textLight,
    marginTop: 8,
  },
});
