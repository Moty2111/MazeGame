const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const LAVENDER = [196, 132, 252];
const DARK_PURPLE = [124, 58, 237];
const MID_PURPLE = [167, 139, 250];
const LIGHT_LAVENDER = [237, 233, 254];
const WHITE = [255, 255, 255];
const PINK = [249, 168, 212];
const GOLD = [251, 191, 36];

function setPixel(pixels, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  pixels[i] = r;
  pixels[i + 1] = g;
  pixels[i + 2] = b;
  pixels[i + 3] = a;
}

function getPixel(pixels, x, y) {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return [0, 0, 0, 0];
  const i = (y * SIZE + x) * 4;
  return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
}

function drawCircle(pixels, cx, cy, radius, r, g, b, a = 255, filled = true) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (filled ? dist <= radius : Math.abs(dist - radius) <= 1.5) {
        setPixel(pixels, x, y, r, g, b, a);
      }
    }
  }
}

function drawEllipse(pixels, cx, cy, rx, ry, r, g, b, a = 255, filled = true) {
  for (let y = cy - ry; y <= cy + ry; y++) {
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dist = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (filled ? dist <= 1 : Math.abs(dist - 1) <= 0.05) {
        setPixel(pixels, x, y, r, g, b, a);
      }
    }
  }
}

function drawTriangle(pixels, x1, y1, x2, y2, x3, y3, r, g, b, a = 255) {
  const minX = Math.max(0, Math.min(x1, x2, x3));
  const maxX = Math.min(SIZE - 1, Math.max(x1, x2, x3));
  const minY = Math.max(0, Math.min(y1, y2, y3));
  const maxY = Math.min(SIZE - 1, Math.max(y1, y2, y3));
  
  function edge(x, y, x1, y1, x2, y2) {
    return (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
  }
  
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const w1 = edge(x, y, x2, y2, x3, y3);
      const w2 = edge(x, y, x3, y3, x1, y1);
      const w3 = edge(x, y, x1, y1, x2, y2);
      const hasNeg = (w1 < 0) || (w2 < 0) || (w3 < 0);
      const hasPos = (w1 > 0) || (w2 > 0) || (w3 > 0);
      if (!(hasNeg && hasPos)) {
        setPixel(pixels, x, y, r, g, b, a);
      }
    }
  }
}

async function generateIcon() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4);
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  // Lavender gradient background
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const dx = (x - cx) / (SIZE * 0.5);
      const dy = (y - cy) / (SIZE * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t = Math.min(dist, 1);
      pixels[i] = Math.round(LAVENDER[0] + (LIGHT_LAVENDER[0] - LAVENDER[0]) * t * 0.5);
      pixels[i + 1] = Math.round(LAVENDER[1] + (LIGHT_LAVENDER[1] - LAVENDER[1]) * t * 0.5);
      pixels[i + 2] = Math.round(LAVENDER[2] + (LIGHT_LAVENDER[2] - LAVENDER[2]) * t * 0.5);
      pixels[i + 3] = 255;
    }
  }

  // Cat ears (triangles)
  const earSize = SIZE * 0.32;
  const earY = cy - SIZE * 0.12;
  // Left ear
  drawTriangle(pixels,
    cx - SIZE * 0.32, earY + earSize * 0.1,
    cx - SIZE * 0.08, earY + earSize * 0.1,
    cx - SIZE * 0.22, earY - earSize * 0.9,
    DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2]
  );
  // Right ear
  drawTriangle(pixels,
    cx + SIZE * 0.08, earY + earSize * 0.1,
    cx + SIZE * 0.32, earY + earSize * 0.1,
    cx + SIZE * 0.22, earY - earSize * 0.9,
    DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2]
  );
  // Inner ear left (pink)
  drawTriangle(pixels,
    cx - SIZE * 0.28, earY + earSize * 0.05,
    cx - SIZE * 0.12, earY + earSize * 0.05,
    cx - SIZE * 0.21, earY - earSize * 0.5,
    PINK[0], PINK[1], PINK[2]
  );
  // Inner ear right (pink)
  drawTriangle(pixels,
    cx + SIZE * 0.12, earY + earSize * 0.05,
    cx + SIZE * 0.28, earY + earSize * 0.05,
    cx + SIZE * 0.21, earY - earSize * 0.5,
    PINK[0], PINK[1], PINK[2]
  );

  // Cat face (oval)
  drawEllipse(pixels, cx, cy + SIZE * 0.02, SIZE * 0.32, SIZE * 0.28, LIGHT_LAVENDER[0], LIGHT_LAVENDER[1], LIGHT_LAVENDER[2]);

  // Eyes
  const eyeY = cy + SIZE * 0.02;
  const eyeX = SIZE * 0.11;
  const eyeR = SIZE * 0.035;
  // Left eye white
  drawEllipse(pixels, cx - eyeX, eyeY, eyeR, eyeR * 1.2, WHITE[0], WHITE[1], WHITE[2]);
  // Right eye white
  drawEllipse(pixels, cx + eyeX, eyeY, eyeR, eyeR * 1.2, WHITE[0], WHITE[1], WHITE[2]);
  // Left pupil
  drawCircle(pixels, cx - eyeX, eyeY, eyeR * 0.5, GOLD[0], GOLD[1], GOLD[2]);
  // Right pupil
  drawCircle(pixels, cx + eyeX, eyeY, eyeR * 0.5, GOLD[0], GOLD[1], GOLD[2]);
  // Left pupil center
  drawCircle(pixels, cx - eyeX, eyeY, eyeR * 0.25, DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2]);
  // Right pupil center
  drawCircle(pixels, cx + eyeX, eyeY, eyeR * 0.25, DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2]);
  // Eye shine
  const shineOff = eyeR * 0.3;
  drawCircle(pixels, cx - eyeX + shineOff, eyeY - shineOff, eyeR * 0.2, WHITE[0], WHITE[1], WHITE[2]);
  drawCircle(pixels, cx + eyeX + shineOff, eyeY - shineOff, eyeR * 0.2, WHITE[0], WHITE[1], WHITE[2]);

  // Nose
  drawTriangle(pixels,
    cx - SIZE * 0.02, cy + SIZE * 0.08,
    cx + SIZE * 0.02, cy + SIZE * 0.08,
    cx, cy + SIZE * 0.12,
    PINK[0], PINK[1], PINK[2]
  );

  // Mouth
  const mouthY = cy + SIZE * 0.13;
  const mouthR = SIZE * 0.025;
  // Left mouth curve
  drawCircle(pixels, cx - mouthR * 1.2, mouthY, mouthR, DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2], 150);
  // Right mouth curve
  drawCircle(pixels, cx + mouthR * 1.2, mouthY, mouthR, DARK_PURPLE[0], DARK_PURPLE[1], DARK_PURPLE[2], 150);

  // Whiskers
  const whiskerY = cy + SIZE * 0.08;
  for (let side = -1; side <= 1; side += 2) {
    for (let i = -1; i <= 1; i++) {
      for (let j = 0; j < 3; j++) {
        const wx = cx + side * (SIZE * 0.14 + j * SIZE * 0.04);
        const wy = whiskerY + i * SIZE * 0.02;
        const size = SIZE * 0.005;
        drawCircle(pixels, wx + (i === 0 ? side * SIZE * 0.02 : 0), wy, size, MID_PURPLE[0], MID_PURPLE[1], MID_PURPLE[2], 180);
      }
    }
  }

  // Cheek blush
  drawCircle(pixels, cx - SIZE * 0.2, cy + SIZE * 0.08, SIZE * 0.04, PINK[0], PINK[1], PINK[2], 80);
  drawCircle(pixels, cx + SIZE * 0.2, cy + SIZE * 0.08, SIZE * 0.04, PINK[0], PINK[1], PINK[2], 80);

  // Rounded corners (transparent)
  const cornerRadius = SIZE * 0.18;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const inCorner =
        (x < cornerRadius && y < cornerRadius && Math.sqrt((cornerRadius - x) ** 2 + (cornerRadius - y) ** 2) > cornerRadius) ||
        (x > SIZE - cornerRadius && y < cornerRadius && Math.sqrt((x - (SIZE - cornerRadius)) ** 2 + (cornerRadius - y) ** 2) > cornerRadius) ||
        (x < cornerRadius && y > SIZE - cornerRadius && Math.sqrt((cornerRadius - x) ** 2 + (y - (SIZE - cornerRadius)) ** 2) > cornerRadius) ||
        (x > SIZE - cornerRadius && y > SIZE - cornerRadius && Math.sqrt((x - (SIZE - cornerRadius)) ** 2 + (y - (SIZE - cornerRadius)) ** 2) > cornerRadius);
      if (inCorner) setPixel(pixels, x, y, 0, 0, 0, 0);
    }
  }

  const outDir = path.join(__dirname, '..', 'assets');
  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
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

  await sharp(pixels, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .resize(1024)
    .png()
    .toFile(path.join(outDir, 'android-icon-foreground.png'));

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
