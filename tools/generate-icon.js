const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const LAVENDER = [192, 132, 252];
const DARK_PURPLE = [124, 58, 237];
const LIGHT_LAVENDER = [237, 233, 254];
const GOLD = [251, 191, 36];
const WHITE = [255, 255, 255];

async function generateIcon() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4);
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background (lighter in center)
      const t = Math.min(dist / (SIZE * 0.5), 1);
      const r = Math.round(LAVENDER[0] + (LIGHT_LAVENDER[0] - LAVENDER[0]) * t);
      const g = Math.round(LAVENDER[1] + (LIGHT_LAVENDER[1] - LAVENDER[1]) * t);
      const b = Math.round(LAVENDER[2] + (LIGHT_LAVENDER[2] - LAVENDER[2]) * t);

      let cr = r, cg = g, cb = b;

      // Cat ears (two triangles)
      const earSize = SIZE * 0.28;
      const earYoff = SIZE * 0.28;
      if (
        (Math.abs(dx + earSize * 0.5) < earSize * 0.55 && dy < -earYoff && dy > -earYoff - earSize) ||
        (Math.abs(dx - earSize * 0.5) < earSize * 0.55 && dy < -earYoff && dy > -earYoff - earSize)
      ) {
        if (Math.abs(dy + earYoff + earSize / 2) > Math.abs(dx) * 1.5 - earSize * 0.3) {
          cr = DARK_PURPLE[0]; cg = DARK_PURPLE[1]; cb = DARK_PURPLE[2];
        }
      }

      // Cat face circle
      const faceRadius = SIZE * 0.27;
      if (dist < faceRadius) {
        cr = LIGHT_LAVENDER[0]; cg = LIGHT_LAVENDER[1]; cb = LIGHT_LAVENDER[2];

        // Eyes
        const eyeRadius = SIZE * 0.04;
        const eyeY = SIZE * 0.08;
        const eyeX = SIZE * 0.09;
        if (
          (Math.sqrt((dx - eyeX) ** 2 + (dy - eyeY) ** 2) < eyeRadius) ||
          (Math.sqrt((dx + eyeX) ** 2 + (dy - eyeY) ** 2) < eyeRadius)
        ) {
          cr = DARK_PURPLE[0]; cg = DARK_PURPLE[1]; cb = DARK_PURPLE[2];
        }
        // Eye shine
        if (
          (Math.sqrt((dx - eyeX + SIZE * 0.015) ** 2 + (dy - eyeY - SIZE * 0.015) ** 2) < eyeRadius * 0.35) ||
          (Math.sqrt((dx + eyeX + SIZE * 0.015) ** 2 + (dy - eyeY - SIZE * 0.015) ** 2) < eyeRadius * 0.35)
        ) {
          cr = WHITE[0]; cg = WHITE[1]; cb = WHITE[2];
        }

        // Nose
        const noseSize = SIZE * 0.02;
        if (Math.abs(dx) < noseSize && Math.abs(dy - SIZE * 0.02) < noseSize * 0.6) {
          cr = GOLD[0]; cg = GOLD[1]; cb = GOLD[2];
        }

        // Whisker dots
        const dotSize = SIZE * 0.008;
        const whiskerY = SIZE * 0.02;
        if (
          (Math.abs(dx - SIZE * 0.06) < dotSize && Math.abs(dy - whiskerY) < dotSize) ||
          (Math.abs(dx + SIZE * 0.06) < dotSize && Math.abs(dy - whiskerY) < dotSize) ||
          (Math.abs(dx - SIZE * 0.1) < dotSize && Math.abs(dy - whiskerY + SIZE * 0.02) < dotSize) ||
          (Math.abs(dx + SIZE * 0.1) < dotSize && Math.abs(dy - whiskerY + SIZE * 0.02) < dotSize)
        ) {
          cr = DARK_PURPLE[0]; cg = DARK_PURPLE[1]; cb = DARK_PURPLE[2];
        }
      }

      // Rounded corners (transparent)
      const cornerRadius = SIZE * 0.14;
      const inCorner =
        (x < cornerRadius && y < cornerRadius && Math.sqrt((cornerRadius - x) ** 2 + (cornerRadius - y) ** 2) > cornerRadius) ||
        (x > SIZE - cornerRadius && y < cornerRadius && Math.sqrt((x - (SIZE - cornerRadius)) ** 2 + (cornerRadius - y) ** 2) > cornerRadius) ||
        (x < cornerRadius && y > SIZE - cornerRadius && Math.sqrt((cornerRadius - x) ** 2 + (y - (SIZE - cornerRadius)) ** 2) > cornerRadius) ||
        (x > SIZE - cornerRadius && y > SIZE - cornerRadius && Math.sqrt((x - (SIZE - cornerRadius)) ** 2 + (y - (SIZE - cornerRadius)) ** 2) > cornerRadius);

      pixels[i] = cr;
      pixels[i + 1] = cg;
      pixels[i + 2] = cb;
      pixels[i + 3] = inCorner ? 0 : 255;
    }
  }

  const outDir = path.join(__dirname, '..', 'assets');
  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(1024)
    .png()
    .toFile(path.join(outDir, 'icon.png'));

  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(48)
    .png()
    .toFile(path.join(outDir, 'favicon.png'));

  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(1024)
    .png()
    .toFile(path.join(outDir, 'splash-icon.png'));

  // Android adaptive icon - foreground (just the center)
  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(1024)
    .png()
    .toFile(path.join(outDir, 'android-icon-foreground.png'));

  // Background (solid lavender)
  const bgPixels = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      bgPixels[i] = LAVENDER[0];
      bgPixels[i + 1] = LAVENDER[1];
      bgPixels[i + 2] = LAVENDER[2];
      bgPixels[i + 3] = 255;
    }
  }
  await sharp(bgPixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(1024)
    .png()
    .toFile(path.join(outDir, 'android-icon-background.png'));

  console.log('Icons generated successfully!');
}

generateIcon().catch(console.error);
