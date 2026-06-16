import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, LEVELS } from './src/constants';
import MainMenu from './src/screens/MainMenu';
import Settings from './src/screens/Settings';
import About from './src/screens/About';
import LevelSelect from './src/screens/LevelSelect';
import Game from './src/screens/Game';
import Finish from './src/screens/Finish';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error('ErrorBoundary:', error);
    this.setState({ error });
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={{ fontSize: 64 }}>😿</Text>
          <Text style={styles.errorText}>Что-то пошло не так</Text>
          <Text style={styles.errorSub}>Перезапусти приложение</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [screen, setScreen] = useState('mainMenu');
  const [settings, setSettings] = useState({
    controlMode: 'swipe',
    vibrationEnabled: true,
  });
  const [completedLevels, setCompletedLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levelResults, setLevelResults] = useState([]);

  const navigate = useCallback((target) => setScreen(target), []);
  const handlePlay = useCallback(() => navigate('levelSelect'), [navigate]);
  const handleSettings = useCallback(() => navigate('settings'), [navigate]);
  const handleAbout = useCallback(() => navigate('about'), [navigate]);
  const handleBack = useCallback(() => {
    if (screen === 'settings' || screen === 'about') navigate('mainMenu');
    else if (screen === 'levelSelect') navigate('mainMenu');
    else if (screen === 'game') navigate('levelSelect');
  }, [screen, navigate]);

  const handleSelectLevel = useCallback((level) => {
    setCurrentLevel(level);
    navigate('game');
  }, [navigate]);

  const handleLevelComplete = useCallback(
    (levelId, moves, time) => {
      const newCompleted = completedLevels.includes(levelId)
        ? completedLevels
        : [...completedLevels, levelId];
      setCompletedLevels(newCompleted);
      setLevelResults((prev) => [...prev, { levelId, moves, time }]);
      if (levelId < LEVELS.length - 1) {
        setCurrentLevel(LEVELS[levelId + 1]);
        navigate('game');
      } else {
        navigate('finish');
      }
    },
    [completedLevels, navigate]
  );

  const handleRestart = useCallback(() => {
    setCompletedLevels([]);
    setCurrentLevel(null);
    setLevelResults([]);
    navigate('mainMenu');
  }, [navigate]);

  const handleUpdateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  const handleResetProgress = useCallback(() => {
    setCompletedLevels([]);
    setCurrentLevel(null);
    setLevelResults([]);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'mainMenu':
        return <MainMenu onPlay={handlePlay} onSettings={handleSettings} onAbout={handleAbout} />;
      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={handleBack}
            onResetProgress={handleResetProgress}
            hasProgress={completedLevels.length > 0}
          />
        );
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
        return (
          <Game
            key={currentLevel?.id ?? 0}
            level={currentLevel || LEVELS[0]}
            onComplete={handleLevelComplete}
            onBack={handleBack}
            settings={settings}
          />
        );
      case 'finish':
        return <Finish onRestart={handleRestart} levelResults={levelResults} />;
      default:
        return <MainMenu onPlay={handlePlay} onSettings={handleSettings} onAbout={handleAbout} />;
    }
  };

  return renderScreen();
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: { fontSize: 22, color: COLORS.text, textAlign: 'center', marginTop: 16 },
  errorSub: { fontSize: 16, color: COLORS.textLight, marginTop: 8 },
});
