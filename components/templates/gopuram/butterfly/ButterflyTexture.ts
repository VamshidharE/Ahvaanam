/**
 * ButterflyTexture.ts
 *
 * Procedurally generates high-resolution, biologically authentic wing textures
 * with ivory/cream membranes, delicate champagne-gold venation, shimmering
 * gold leaf margins, and subtle translucency suited to the Ahvaanam wedding theme.
 */

export function createForewingCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.save();
  ctx.beginPath();
  // Root at bottom-left (30, 480)
  ctx.moveTo(30, 480);
  // Leading edge (Costa) sweeping up to apex (470, 30)
  ctx.bezierCurveTo(40, 260, 130, 70, 470, 30);
  // Apex rounded tip
  ctx.bezierCurveTo(500, 40, 505, 80, 475, 130);
  // Outer margin (termen) with scalloped ripples
  ctx.bezierCurveTo(445, 190, 415, 255, 395, 320);
  ctx.bezierCurveTo(375, 385, 325, 435, 260, 460);
  // Inner margin (dorsum) back to root
  ctx.bezierCurveTo(180, 475, 100, 480, 30, 480);
  ctx.closePath();

  // Radiant ivory/cream base gradient
  const grad = ctx.createRadialGradient(160, 340, 30, 260, 240, 300);
  grad.addColorStop(0, "rgba(255, 254, 248, 0.96)");
  grad.addColorStop(0.35, "rgba(254, 247, 230, 0.92)");
  grad.addColorStop(0.7, "rgba(245, 226, 185, 0.88)");
  grad.addColorStop(1, "rgba(215, 180, 120, 0.95)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Champagne-gold outer border band
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(175, 130, 50, 0.75)";
  ctx.stroke();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "#d4af37";
  ctx.stroke();

  // Clip to wing interior for veins and details
  ctx.clip();

  // Discal cell (central anatomical loop)
  ctx.beginPath();
  ctx.moveTo(90, 430);
  ctx.bezierCurveTo(120, 340, 180, 260, 275, 230);
  ctx.bezierCurveTo(300, 270, 280, 330, 200, 390);
  ctx.closePath();
  ctx.strokeStyle = "rgba(180, 135, 50, 0.85)";
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.fill();

  // Radiating longitudinal veins
  const veins = [
    { start: [275, 230], cp1: [330, 160], cp2: [400, 90], end: [465, 55] },
    { start: [285, 250], cp1: [360, 190], cp2: [430, 140], end: [468, 120] },
    { start: [278, 280], cp1: [360, 240], cp2: [415, 220], end: [435, 205] },
    { start: [250, 320], cp1: [330, 300], cp2: [385, 290], end: [400, 285] },
    { start: [200, 390], cp1: [280, 385], cp2: [335, 385], end: [350, 380] },
  ];

  ctx.lineWidth = 2.0;
  ctx.strokeStyle = "rgba(195, 150, 60, 0.78)";
  for (const v of veins) {
    ctx.beginPath();
    ctx.moveTo(v.start[0], v.start[1]);
    ctx.bezierCurveTo(v.cp1[0], v.cp1[1], v.cp2[0], v.cp2[1], v.end[0], v.end[1]);
    ctx.stroke();
  }

  // Margin gold foil flecks
  ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
  const flecks = [
    [460, 70], [455, 110], [430, 170], [410, 235], [385, 305], [345, 375], [295, 420],
  ];
  for (const [fx, fy] of flecks) {
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  return canvas;
}

export function createHindwingCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.save();
  ctx.beginPath();
  // Root at top-left (70, 40)
  ctx.moveTo(70, 40);
  // Anterior margin curving outward
  ctx.bezierCurveTo(150, 40, 290, 60, 400, 110);
  // Scalloped outer margin with swallowtail lobe
  ctx.bezierCurveTo(450, 160, 470, 240, 440, 320);
  // Graceful swallowtail projection tip
  ctx.bezierCurveTo(430, 360, 420, 420, 380, 460);
  ctx.bezierCurveTo(365, 470, 350, 460, 345, 430);
  // Inner margin scallops back toward body
  ctx.bezierCurveTo(310, 440, 230, 430, 150, 370);
  ctx.bezierCurveTo(100, 330, 75, 210, 70, 40);
  ctx.closePath();

  // Warm amber/ivory gradient fill
  const grad = ctx.createRadialGradient(200, 200, 40, 260, 260, 260);
  grad.addColorStop(0, "rgba(255, 252, 242, 0.96)");
  grad.addColorStop(0.4, "rgba(250, 238, 205, 0.92)");
  grad.addColorStop(0.75, "rgba(235, 205, 145, 0.88)");
  grad.addColorStop(1, "rgba(200, 155, 85, 0.95)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Gold outer filigree stroke
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(175, 130, 50, 0.75)";
  ctx.stroke();
  ctx.lineWidth = 3.0;
  ctx.strokeStyle = "#d4af37";
  ctx.stroke();

  ctx.clip();

  // Central loop & branching veins
  ctx.beginPath();
  ctx.moveTo(110, 80);
  ctx.bezierCurveTo(160, 140, 200, 200, 240, 260);
  ctx.bezierCurveTo(230, 290, 190, 290, 140, 260);
  ctx.closePath();
  ctx.strokeStyle = "rgba(180, 135, 50, 0.8)";
  ctx.lineWidth = 3.0;
  ctx.stroke();

  const hVeins = [
    { start: [240, 260], cp1: [320, 240], cp2: [390, 200], end: [430, 180] },
    { start: [238, 275], cp1: [330, 290], cp2: [390, 280], end: [430, 275] },
    { start: [225, 288], cp1: [310, 350], cp2: [365, 380], end: [375, 440] },
    { start: [175, 280], cp1: [210, 350], cp2: [250, 380], end: [280, 410] },
  ];

  ctx.lineWidth = 2.0;
  ctx.strokeStyle = "rgba(195, 150, 60, 0.75)";
  for (const v of hVeins) {
    ctx.beginPath();
    ctx.moveTo(v.start[0], v.start[1]);
    ctx.bezierCurveTo(v.cp1[0], v.cp1[1], v.cp2[0], v.cp2[1], v.end[0], v.end[1]);
    ctx.stroke();
  }

  // Auspicious eyespot on hindwing margin
  ctx.beginPath();
  ctx.arc(385, 320, 11, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(120, 25, 20, 0.9)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#ffd700";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(386, 319, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffe082";
  ctx.fill();

  ctx.restore();
  return canvas;
}
