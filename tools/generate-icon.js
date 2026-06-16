const sharp = require('sharp');
const path = require('path');

const S = 1024;
const HS = S / 2;

function put(pix, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= S || y < 0 || y >= S) return;
  const i = (y * S + x) * 4;
  pix[i] = r; pix[i+1] = g; pix[i+2] = b; pix[i+3] = a;
}

function circle(pix, cx, cy, rad, r, g, b, a = 255, fill = true) {
  const r2 = rad * rad;
  for (let y = cy - rad; y <= cy + rad; y++) {
    for (let x = cx - rad; x <= cx + rad; x++) {
      const d2 = (x-cx)*(x-cx) + (y-cy)*(y-cy);
      if (fill ? d2 <= r2 : Math.abs(Math.sqrt(d2) - rad) <= 1.5) put(pix, x, y, r, g, b, a);
    }
  }
}

function ellipse(pix, cx, cy, rx, ry, r, g, b, a = 255, fill = true, rot = 0) {
  const cos = Math.cos(rot), sin = Math.sin(rot);
  for (let y = cy - ry; y <= cy + ry; y++) {
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dx = x-cx, dy = y-cy;
      const rx2 = rx*rx, ry2 = ry*ry;
      const ux = dx*cos + dy*sin, uy = -dx*sin + dy*cos;
      const d2 = (ux*ux)/(rx2) + (uy*uy)/(ry2);
      if (fill ? d2 <= 1 : Math.abs(d2 - 1) <= 0.05) put(pix, x, y, r, g, b, a);
    }
  }
}

function tri(pix, x1, y1, x2, y2, x3, y3, r, g, b, a = 255) {
  const mnX = Math.max(0, Math.min(x1, x2, x3));
  const mxX = Math.min(S-1, Math.max(x1, x2, x3));
  const mnY = Math.max(0, Math.min(y1, y2, y3));
  const mxY = Math.min(S-1, Math.max(y1, y2, y3));
  function edge(x, y, ax, ay, bx, by) { return (bx-ax)*(y-ay) - (by-ay)*(x-ax); }
  for (let y = mnY; y <= mxY; y++) {
    for (let x = mnX; x <= mxX; x++) {
      const w1 = edge(x, y, x2, y2, x3, y3);
      const w2 = edge(x, y, x3, y3, x1, y1);
      const w3 = edge(x, y, x1, y1, x2, y2);
      const neg = w1 < 0 || w2 < 0 || w3 < 0;
      const pos = w1 > 0 || w2 > 0 || w3 > 0;
      if (!(neg && pos)) put(pix, x, y, r, g, b, a);
    }
  }
}

function gradient(pix, x1, y1, x2, y2, r1, g1, b1, r2, g2, b2) {
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = x2 - x1, dy = y2 - y1;
      const len2 = dx*dx + dy*dy;
      let t = len2 > 0 ? ((x - x1)*dx + (y - y1)*dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      put(pix, x, y,
        Math.round(r1 + (r2 - r1) * t),
        Math.round(g1 + (g2 - g1) * t),
        Math.round(b1 + (b2 - b1) * t), 255);
    }
  }
}

function glow(pix, cx, cy, rad, r, g, b, maxA = 80) {
  for (let y = cy - rad; y <= cy + rad; y++) {
    for (let x = cx - rad; x <= cx + rad; x++) {
      const d = Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
      if (d <= rad) {
        const a = Math.round(maxA * (1 - d/rad));
        if (a > 0) {
          const i = (y * S + x) * 4;
          const alpha = a / 255;
          pix[i] = Math.round(pix[i] * (1 - alpha) + r * alpha);
          pix[i+1] = Math.round(pix[i+1] * (1 - alpha) + g * alpha);
          pix[i+2] = Math.round(pix[i+2] * (1 - alpha) + b * alpha);
        }
      }
    }
  }
}

async function main() {
  const pix = Buffer.alloc(S * S * 4);

  // radial gradient background
  const c1 = [245, 222, 254], c2 = [255, 248, 240];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - HS) / HS, dy = (y - HS) / HS;
      const t = Math.min(1, Math.sqrt(dx*dx + dy*dy));
      put(pix, x, y,
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t), 255);
    }
  }

  // maze pattern background (subtle)
  const mazeColor = [196, 132, 252, 15];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const x = c * (S / 8), y = r * (S / 8);
      const sz = S / 8;
      // left wall
      if (Math.random() > 0.4) {
        for (let ly = 0; ly < sz; ly++) put(pix, x, y + ly, ...mazeColor);
      }
      // top wall
      if (Math.random() > 0.4) {
        for (let lx = 0; lx < sz; lx++) put(pix, x + lx, y, ...mazeColor);
      }
    }
  }

  // circular glow behind cat
  glow(pix, HS, HS - 20, 340, 196, 132, 252, 60);

  // cat ears (outer - dark purple)
  const earOff = 190, earH = 280, earW = 160;
  tri(pix, HS - earOff, HS - 40, HS - earOff + earW, HS - 40, HS - earOff + earW/2, HS - earH, 124, 58, 237);
  tri(pix, HS + earOff - earW, HS - 40, HS + earOff, HS - 40, HS + earOff - earW/2, HS - earH, 124, 58, 237);

  // inner ear (pink)
  const ieW = 90, ieH = 160;
  tri(pix, HS - earOff + 35, HS - 35, HS - earOff + 35 + ieW, HS - 35, HS - earOff + earW/2, HS - earH + 60, 249, 168, 212);
  tri(pix, HS + earOff - 35 - ieW, HS - 35, HS + earOff - 35, HS - 35, HS + earOff - earW/2, HS - earH + 60, 249, 168, 212);

  // head (main circle)
  circle(pix, HS, HS + 10, 310, 255, 255, 255);
  circle(pix, HS, HS + 10, 308, 237, 233, 254, 255);

  // cheeks blush
  circle(pix, HS - 180, HS + 90, 50, 249, 168, 212, 60);
  circle(pix, HS + 180, HS + 90, 50, 249, 168, 212, 60);

  // eye whites
  const eyeY = HS - 10, eyeOff = 130, eyeR = 52, eyeRy = 58;
  ellipse(pix, HS - eyeOff, eyeY, eyeR, eyeRy, 255, 255, 255);
  ellipse(pix, HS + eyeOff, eyeY, eyeR, eyeRy, 255, 255, 255);

  // eye outlines
  ellipse(pix, HS - eyeOff, eyeY, eyeR, eyeRy, 124, 58, 237, 200, false);
  ellipse(pix, HS + eyeOff, eyeY, eyeR, eyeRy, 124, 58, 237, 200, false);

  // iris (golden/green)
  const irR = 28;
  circle(pix, HS - eyeOff, eyeY, irR, 251, 191, 36);
  circle(pix, HS + eyeOff, eyeY, irR, 251, 191, 36);

  // iris gradient (top darker)
  for (let dy = -irR; dy <= 0; dy++) {
    for (let dx = -irR; dx <= irR; dx++) {
      const d2 = dx*dx + dy*dy;
      if (d2 <= irR*irR) {
        const t = 1 - (dy + irR) / irR;
        const darken = Math.round(t * 40);
        for (const off of [-eyeOff, eyeOff]) {
          const i = ((eyeY + dy) * S + (HS + off + dx)) * 4;
          if (i >= 0 && i < pix.length - 3) {
            pix[i] = Math.max(0, pix[i] - darken);
            pix[i+1] = Math.max(0, pix[i+1] - darken);
            pix[i+2] = Math.max(0, pix[i+2] - darken);
          }
        }
      }
    }
  }

  // pupil
  const pupR = 16;
  circle(pix, HS - eyeOff, eyeY, pupR, 30, 30, 50);
  circle(pix, HS + eyeOff, eyeY, pupR, 30, 30, 50);

  // eye shine
  const shX = 15, shY = -18, shR = 14;
  circle(pix, HS - eyeOff + shX, eyeY + shY, shR, 255, 255, 255, 220);
  circle(pix, HS + eyeOff + shX, eyeY + shY, shR, 255, 255, 255, 220);
  circle(pix, HS - eyeOff - shX/2, eyeY + shY + 8, 6, 255, 255, 255, 160);
  circle(pix, HS + eyeOff - shX/2, eyeY + shY + 8, 6, 255, 255, 255, 160);

  // nose
  const nX = HS, nY = HS + 70, nS = 24;
  tri(pix, nX - nS, nY, nX + nS, nY, nX, nY + nS, 249, 168, 212);

  // nose highlight
  tri(pix, nX - 8, nY, nX + 8, nY, nX, nY + 10, 255, 200, 230);

  // mouth
  const mY = nY + nS + 8, mR = 22;
  for (const side of [-1, 1]) {
    const mx = nX + side * 28;
    // mouth arc
    for (let a = 0; a <= Math.PI * 0.8; a += 0.05) {
      const ex = mx + Math.cos(a) * mR * side;
      const ey = mY - Math.sin(a) * mR * 0.7;
      put(pix, Math.round(ex), Math.round(ey), 80, 60, 100, 180);
    }
  }

  // whiskers
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const wy = HS + 50 + i * 22;
      const wx = HS + side * 200;
      for (let j = 0; j < 30; j++) {
        const px = Math.round(wx + side * j * 3);
        const py = Math.round(wy + Math.sin(j * 0.4) * 6);
        put(pix, px, py, 167, 139, 250, 180 - j * 4);
      }
    }
  }

  // top highlight on head
  ellipse(pix, HS, HS - 130, 180, 80, 255, 255, 255, 60);

  // rounded corners mask
  const cr = 180;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const inCorner =
        (x < cr && y < cr && Math.sqrt((cr - x)**2 + (cr - y)**2) > cr) ||
        (x > S - cr && y < cr && Math.sqrt((x - (S - cr))**2 + (cr - y)**2) > cr) ||
        (x < cr && y > S - cr && Math.sqrt((cr - x)**2 + (y - (S - cr))**2) > cr) ||
        (x > S - cr && y > S - cr && Math.sqrt((x - (S - cr))**2 + (y - (S - cr))**2) > cr);
      if (inCorner) put(pix, x, y, 0, 0, 0, 0);
    }
  }

  const outDir = path.join(__dirname, '..', 'assets');

  // SVG badge overlay with "ЛК" text
  const badgeSvg = Buffer.from(
    `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#C084FC"/>
        </linearGradient>
      </defs>
      <rect x="340" y="780" width="344" height="140" rx="70" ry="70" fill="url(#bg)" opacity="0.92"/>
      <text x="512" y="878" text-anchor="middle" font-family="sans-serif" font-weight="800"
            font-size="80" fill="white" letter-spacing="8">ЛК</text>
    </svg>`
  );

  async function overlayBadge(srcBuf) {
    return sharp(srcBuf, { raw: { width: S, height: S, channels: 4 } })
      .composite([{ input: badgeSvg, top: 0, left: 0 }])
      .png().toBuffer();
  }

  const iconBuf = await overlayBadge(pix);
  await sharp(iconBuf).toFile(path.join(outDir, 'icon.png'));

  const f48Buf = await overlayBadge(pix);
  await sharp(f48Buf).resize(48).toFile(path.join(outDir, 'favicon.png'));

  await sharp(iconBuf).resize(1024).toFile(path.join(outDir, 'splash-icon.png'));

  // adaptive icon foreground
  const fgPix = Buffer.alloc(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      fgPix[i] = pix[i]; fgPix[i+1] = pix[i+1]; fgPix[i+2] = pix[i+2]; fgPix[i+3] = pix[i+3];
    }
  }
  const fgBuf = await overlayBadge(fgPix);
  await sharp(fgBuf).resize(1024).toFile(path.join(outDir, 'android-icon-foreground.png'));

  // adaptive icon background
  const bgPix = Buffer.alloc(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      bgPix[i] = 237; bgPix[i+1] = 233; bgPix[i+2] = 254; bgPix[i+3] = 255;
    }
  }
  await sharp(bgPix, { raw: { width: S, height: S, channels: 4 } })
    .resize(1024).png().toFile(path.join(outDir, 'android-icon-background.png'));

  // monochrome icon
  const monoPix = Buffer.alloc(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const avg = Math.round(pix[i] * 0.3 + pix[i+1] * 0.59 + pix[i+2] * 0.11);
      monoPix[i] = avg; monoPix[i+1] = avg; monoPix[i+2] = avg;
      monoPix[i+3] = pix[i+3];
    }
  }
  await sharp(monoPix, { raw: { width: S, height: S, channels: 4 } })
    .resize(1024).png().toFile(path.join(outDir, 'android-icon-monochrome.png'));

  console.log('Icons generated successfully!');
}

main().catch(console.error);
