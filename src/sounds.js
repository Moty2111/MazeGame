import { Audio } from 'expo-av';

let musicSound = null;
let isMusicLoaded = false;

export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch (_) {}
}

export async function loadMusic() {
  try {
    if (musicSound) {
      await musicSound.unloadAsync();
      musicSound = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/music.mp3'),
      { isLooping: true, volume: 0.6 },
      null,
      true
    );
    musicSound = sound;
    isMusicLoaded = true;
  } catch (_) {
    isMusicLoaded = false;
  }
}

export async function playMusic(volume = 0.6) {
  if (!isMusicLoaded || !musicSound) return;
  try {
    await musicSound.setVolumeAsync(volume);
    await musicSound.playAsync();
  } catch (_) {}
}

export async function pauseMusic() {
  if (!isMusicLoaded || !musicSound) return;
  try {
    await musicSound.pauseAsync();
  } catch (_) {}
}

export async function setMusicVolume(volume) {
  if (!isMusicLoaded || !musicSound) return;
  try {
    await musicSound.setVolumeAsync(volume);
  } catch (_) {}
}

export async function unloadMusic() {
  if (musicSound) {
    try { await musicSound.unloadAsync(); } catch (_) {}
    musicSound = null;
    isMusicLoaded = false;
  }
}

let sfxCache = {};

export async function playMoveSfx() {
  // light tap on move
}

export async function playWinSfx() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/music.mp3'),
      { volume: 1.0, positionMillis: 0 }
    );
    sfxCache.win = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        delete sfxCache.win;
      }
    });
  } catch (_) {}
}
