let Audio = null;
try { Audio = require('expo-av').Audio; } catch (_) {}

let musicSound = null;
let isMusicLoaded = false;

function guard(fn) {
  try { return fn(); } catch (_) { return null; }
}

export async function initAudio() {
  if (!Audio) return;
  await guard(async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  });
}

export async function loadMusic() {
  if (!Audio) return;
  await guard(async () => {
    if (musicSound) { await musicSound.unloadAsync(); musicSound = null; }
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/music.mp3'),
      { isLooping: true, volume: 0.6 },
      null,
      true
    );
    musicSound = sound;
    isMusicLoaded = true;
  });
}

export async function playMusic(volume = 0.6) {
  if (!isMusicLoaded || !musicSound) return;
  await guard(async () => {
    await musicSound.setVolumeAsync(volume);
    await musicSound.playAsync();
  });
}

export async function pauseMusic() {
  if (!isMusicLoaded || !musicSound) return;
  await guard(async () => {
    await musicSound.pauseAsync();
  });
}

export async function setMusicVolume(volume) {
  if (!isMusicLoaded || !musicSound) return;
  await guard(async () => {
    await musicSound.setVolumeAsync(volume);
  });
}

export async function unloadMusic() {
  if (musicSound) {
    await guard(async () => { await musicSound.unloadAsync(); });
    musicSound = null;
    isMusicLoaded = false;
  }
}
