/**
 * drawField.js
 * All canvas drawing primitives for the 2D cricket field.
 * Each function accepts a CanvasRenderingContext2D, width, and height.
 */

export function drawSky(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.46);
  grad.addColorStop(0, "#0a1628");
  grad.addColorStop(0.6, "#0d2137");
  grad.addColorStop(1, "#1a4f72");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H * 0.46);
}

export function drawStars(ctx, W, H) {
  const positions = [
    [0.03,0.05],[0.13,0.03],[0.25,0.07],[0.38,0.03],[0.52,0.06],
    [0.67,0.02],[0.80,0.07],[0.91,0.04],[0.10,0.12],[0.58,0.09],
    [0.44,0.13],[0.72,0.11],[0.88,0.14],[0.20,0.15],[0.33,0.10],
  ];
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  positions.forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.arc(fx * W, fy * H * 0.44, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawFloodlights(ctx, W, H) {
  const towers = [W * 0.06, W * 0.94];
  towers.forEach((tx) => {
    const ty = H * 0.04;
    // Pole
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(tx - 4, ty, 8, H * 0.28);
    // Light bar
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(tx - 20, ty - 10, 40, 10);
    // Bulbs
    for (let b = -3; b <= 3; b++) {
      ctx.fillStyle = "#fff8dc";
      ctx.beginPath();
      ctx.arc(tx + b * 5.5, ty - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Light cone glow
    const cone = ctx.createRadialGradient(tx, ty, 0, tx, ty + 80, 110);
    cone.addColorStop(0, "rgba(255,240,150,0.16)");
    cone.addColorStop(1, "rgba(255,240,150,0)");
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(tx - 20, ty);
    ctx.lineTo(tx - 70, ty + 140);
    ctx.lineTo(tx + 70, ty + 140);
    ctx.lineTo(tx + 20, ty);
    ctx.closePath();
    ctx.fill();
  });
}

export function drawStands(ctx, W, H) {
  // Stand background
  const grad = ctx.createLinearGradient(0, H * 0.30, 0, H * 0.47);
  grad.addColorStop(0, "#1c2833");
  grad.addColorStop(1, "#17202a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * 0.30, W, H * 0.17);

  // Crowd spectators (coloured circles)
  const palette = ["#e74c3c","#3498db","#f1c40f","#2ecc71","#e67e22","#9b59b6","#ecf0f1","#1abc9c"];
  for (let i = 0; i < 65; i++) {
    const cx = 12 + (i * 9.8) % (W - 18);
    const cy = H * 0.32 + (i % 4) * 10;
    ctx.fillStyle = palette[i % palette.length];
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    // simple head highlight
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.arc(cx - 1.5, cy - 1.5, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawOutfield(ctx, W, H) {
  // Main grass
  const grad = ctx.createLinearGradient(0, H * 0.46, 0, H);
  grad.addColorStop(0, "#1e8449");
  grad.addColorStop(0.45, "#196f3d");
  grad.addColorStop(1, "#145a32");
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * 0.46, W, H * 0.54);

  // Mowing stripes
  const stripeCount = 12;
  for (let s = 0; s < stripeCount; s++) {
    const sy = H * 0.46 + (s / stripeCount) * H * 0.54;
    const sh = H * 0.54 / stripeCount;
    ctx.fillStyle = s % 2 === 0 ? "rgba(0,0,0,0.055)" : "rgba(255,255,255,0.025)";
    ctx.fillRect(0, sy, W, sh);
  }

  // Circular boundary rope (ellipse)
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.75, W * 0.44, H * 0.22, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawPitch(ctx, W, H) {
  const pX = W * 0.35, pW = W * 0.30;
  const pY = H * 0.50, pH = H * 0.44;

  // Pitch surface
  const grad = ctx.createLinearGradient(pX, pY, pX, pY + pH);
  grad.addColorStop(0, "#c8a96e");
  grad.addColorStop(0.5, "#b8904e");
  grad.addColorStop(1, "#9e7440");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(pX, pY, pW, pH, 5);
  ctx.fill();

  // Pitch edge shadow
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pX, pY, pW, pH, 5);
  ctx.stroke();

  // Worn cracks
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  [
    [pX + pW * 0.25, pY + pH * 0.25, pX + pW * 0.40, pY + pH * 0.45],
    [pX + pW * 0.55, pY + pH * 0.20, pX + pW * 0.70, pY + pH * 0.42],
    [pX + pW * 0.35, pY + pH * 0.55, pX + pW * 0.50, pY + pH * 0.68],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Crease lines
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = 2.5;
  const creaseY1 = pY + pH * 0.10;
  const creaseY2 = pY + pH * 0.90;
  ctx.beginPath(); ctx.moveTo(pX - 10, creaseY1); ctx.lineTo(pX + pW + 10, creaseY1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pX - 10, creaseY2); ctx.lineTo(pX + pW + 10, creaseY2); ctx.stroke();

  return { pX, pW, pY, pH, creaseY1, creaseY2 };
}

export function drawStumps(ctx, cx, baseY, scale = 1) {
  const offsets = [-10 * scale, 0, 10 * scale];
  const stumpH  = 22 * scale;
  const bailW   = 28 * scale;

  // Stumps
  offsets.forEach((ox) => {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(cx + ox - 2 * scale, baseY - stumpH, 4 * scale, stumpH);
  });
  // Bails
  ctx.fillStyle = "#ddd";
  ctx.fillRect(cx - bailW / 2, baseY - stumpH - 5 * scale, bailW, 5 * scale);
}

export function drawBatsman(ctx, x, y, hitProgress = 0) {
  ctx.save();
  // Lateral nudge on hit
  const nudge = hitProgress > 0 ? Math.sin(hitProgress * Math.PI) * 11 : 0;
  ctx.translate(x + nudge, y);

  // Drop shadow
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(2, 52, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs & pads
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(-11, 28, 10, 24);
  ctx.fillRect(2, 28, 10, 24);
  // Pad straps
  ctx.fillStyle = "#bdc3c7";
  ctx.fillRect(-11, 44, 10, 5);
  ctx.fillRect(2, 44, 10, 5);
  ctx.fillRect(-11, 34, 10, 3);
  ctx.fillRect(2, 34, 10, 3);

  // Jersey body
  const jerseyGrad = ctx.createLinearGradient(-15, 0, 15, 0);
  jerseyGrad.addColorStop(0, "#27ae60");
  jerseyGrad.addColorStop(1, "#1e8449");
  ctx.fillStyle = jerseyGrad;
  ctx.beginPath();
  ctx.roundRect(-15, 3, 30, 27, 5);
  ctx.fill();
  // Jersey collar
  ctx.fillStyle = "#f1c40f";
  ctx.fillRect(-15, 14, 30, 4);
  ctx.fillRect(-15, 3, 30, 5);

  // Arms
  ctx.fillStyle = "#f8c471";
  ctx.fillRect(-20, 3, 9, 18);
  ctx.fillRect(11, 3, 9, 18);

  // Gloves
  ctx.fillStyle = "#e67e22";
  ctx.fillRect(-20, 18, 9, 7);
  ctx.fillRect(11, 18, 9, 7);

  // Helmet
  ctx.fillStyle = "#27ae60";
  ctx.beginPath();
  ctx.arc(0, -6, 13, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-13, -6, 26, 9);
  // Grill / visor
  ctx.fillStyle = "#1a252f";
  ctx.fillRect(-14, -6, 11, 6);
  for (let g = 0; g < 4; g++) {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(-13 + g * 3, -6, 1.5, 6);
  }

  // Face
  ctx.fillStyle = "#f8c471";
  ctx.beginPath();
  ctx.arc(0, -3, 9, 0, Math.PI * 2);
  ctx.fill();

  // BAT — rotates on hit
  const batAngle = hitProgress > 0 ? -0.6 + hitProgress * 1.8 : 0.15;
  ctx.save();
  ctx.translate(18, 12);
  ctx.rotate(batAngle);
  // Handle
  ctx.fillStyle = "#c8a217";
  ctx.fillRect(-2.5, -10, 5, 14);
  // Grip wrapping lines
  ctx.strokeStyle = "#9a7a10";
  ctx.lineWidth = 1;
  for (let g = -8; g < 4; g += 3) {
    ctx.beginPath(); ctx.moveTo(-2.5, g); ctx.lineTo(2.5, g); ctx.stroke();
  }
  // Blade
  ctx.fillStyle = "#b8860b";
  ctx.beginPath();
  ctx.roundRect(-5.5, 4, 11, 34, 3);
  ctx.fill();
  // Blade grain lines
  ctx.strokeStyle = "rgba(180,130,5,0.5)";
  ctx.lineWidth = 0.8;
  for (let g = 0; g < 3; g++) {
    ctx.beginPath();
    ctx.moveTo(-3 + g * 3, 6);
    ctx.lineTo(-3 + g * 3, 34);
    ctx.stroke();
  }
  // Blade edge highlight
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(-5.5, 4, 11, 34, 3);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export function drawBowler(ctx, x, y, isRunningIn = false) {
  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 46, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(-9, 28, 8, 18);
  ctx.fillRect(2, 28, 8, 18);
  if (isRunningIn) {
    // Stride pose
    ctx.fillRect(-9, 28, 8, 14);
    ctx.save();
    ctx.translate(-5, 28);
    ctx.rotate(0.3);
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(-4, 0, 8, 16);
    ctx.restore();
  }

  // Jersey
  const jerseyG = ctx.createLinearGradient(-13, 0, 13, 0);
  jerseyG.addColorStop(0, "#c0392b");
  jerseyG.addColorStop(1, "#e74c3c");
  ctx.fillStyle = jerseyG;
  ctx.beginPath();
  ctx.roundRect(-13, 2, 26, 26, 4);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(-13, 13, 26, 4);

  // Arms
  ctx.fillStyle = "#f8c471";
  ctx.fillRect(-20, 2, 9, 15);
  // Bowling arm — raised on delivery
  if (isRunningIn) {
    ctx.save();
    ctx.translate(11, 6);
    ctx.rotate(-1.1);
    ctx.fillStyle = "#f8c471";
    ctx.fillRect(-4, 0, 8, 18);
    ctx.restore();
  } else {
    ctx.fillRect(11, 2, 9, 15);
  }

  // Head
  ctx.fillStyle = "#f8c471";
  ctx.beginPath();
  ctx.arc(0, -5, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c0392b";
  ctx.beginPath();
  ctx.arc(0, -5, 10, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(-10, -5, 20, 6);

  ctx.restore();
}

export function drawBall(ctx, x, y, radius = 7) {
  ctx.save();
  ctx.shadowColor = "rgba(200, 50, 50, 0.55)";
  ctx.shadowBlur = 14;

  // Ball body
  ctx.fillStyle = "#c0392b";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Leather seam (vertical)
  ctx.strokeStyle = "#7b241c";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Seam curve
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#f5cba7";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius + 2, y);
  ctx.bezierCurveTo(x - radius * 0.3, y - radius, x + radius * 0.3, y + radius, x + radius - 2, y);
  ctx.stroke();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.arc(x - radius * 0.35, y - radius * 0.35, radius * 0.38, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawOutcomeFlash(ctx, W, H, outcome) {
  if (outcome === null) return;
  const label = outcome === "W" ? "OUT!" : outcome === 0 ? "●" : `${outcome}${outcome >= 4 ? " ★" : ""}`;
  const col   = outcome === "W" ? "#e74c3c"
              : outcome >= 6   ? "#27ae60"
              : outcome >= 4   ? "#f1c40f"
              : "#ecf0f1";

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fs = outcome === "W" || outcome >= 4 ? 56 : 46;
  ctx.font = `900 ${fs}px 'Trebuchet MS', sans-serif`;
  ctx.shadowColor = col;
  ctx.shadowBlur  = 32;
  ctx.fillStyle   = col;
  ctx.fillText(label, W * 0.5, H * 0.55);
  ctx.restore();
}
