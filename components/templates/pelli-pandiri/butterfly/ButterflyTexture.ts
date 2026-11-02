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

  // Radiating gold veins branching to the margins
  const veins = [
    [[275, 230], [340, 170], [420, 110], [465, 80]],
    [[275, 230], [360, 190], [435, 150], [465, 130]],
    [[285, 260], [370, 250], [430, 230], [450, 220]],
    [[275, 290], [355, 305], [405, 310], [425, 295]],
    [[240, 340], [315, 370], [365, 385], [385, 385]],
    [[200, 390], [255, 425], [290, 445], [310, 450]],
    [[30, 480], [65, 320], [125, 170], [250, 85], [420, 45]] // Subcostal vein
  ];

  veins.forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(v[0][0], v[0][1]);
    for (let i = 1; i < v.length; i++) ctx.lineTo(v[i][0], v[i][1]);
    ctx.strokeStyle = "rgba(165, 120, 35, 0.82)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 235, 175, 0.72)";
    ctx.lineWidth = 0.85;
    ctx.stroke();
  });

  // Delicate gold leaf dusting near the wing root
  for (let i = 0; i < 220; i++) {
    const gx = 40 + Math.random() * 180;
    const gy = 310 + Math.random() * 150;
    ctx.fillStyle = `rgba(212, 175, 55, ${0.2 + Math.random() * 0.55})`;
    ctx.beginPath();
    ctx.arc(gx, gy, 1 + Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pearl & gold lunules along the outer margin
  const marginDots = [
    [470, 105], [455, 140], [438, 180], [420, 225],
    [400, 270], [378, 315], [352, 360], [320, 400], [285, 435]
  ];
  marginDots.forEach((d) => {
    ctx.fillStyle = "#fffdf5";
    ctx.beginPath();
    ctx.arc(d[0], d[1], 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

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
  // Root at top-left (30, 40)
  ctx.moveTo(30, 40);
  // Costal margin
  ctx.bezierCurveTo(120, 40, 260, 60, 380, 110);
  // Outer scalloped margin
  ctx.bezierCurveTo(430, 150, 445, 210, 420, 270);
  ctx.bezierCurveTo(430, 320, 405, 380, 365, 430);
  // Swallowtail tail extension
  ctx.bezierCurveTo(350, 475, 315, 485, 285, 450);
  // Anal lobe
  ctx.bezierCurveTo(230, 470, 140, 435, 90, 360);
  // Inner margin back to root
  ctx.bezierCurveTo(60, 270, 40, 150, 30, 40);
  ctx.closePath();

  const grad = ctx.createRadialGradient(180, 180, 30, 240, 240, 260);
  grad.addColorStop(0, "rgba(255, 254, 248, 0.96)");
  grad.addColorStop(0.4, "rgba(253, 244, 222, 0.92)");
  grad.addColorStop(0.75, "rgba(244, 224, 180, 0.88)");
  grad.addColorStop(1, "rgba(215, 178, 118, 0.95)");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(170, 125, 45, 0.75)";
  ctx.stroke();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = "#d4af37";
  ctx.stroke();

  ctx.clip();

  // Discal cell
  ctx.beginPath();
  ctx.moveTo(80, 80);
  ctx.bezierCurveTo(140, 90, 220, 135, 240, 200);
  ctx.bezierCurveTo(220, 250, 155, 260, 110, 205);
  ctx.closePath();
  ctx.strokeStyle = "rgba(180, 135, 50, 0.85)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.fill();

  const hVeins = [
    [[240, 180], [315, 160], [380, 165]],
    [[240, 200], [330, 215], [390, 230]],
    [[230, 230], [325, 285], [375, 315]],
    [[200, 250], [285, 340], [335, 385]],
    [[155, 260], [220, 365], [265, 415]],
    [[110, 240], [140, 355], [160, 395]]
  ];
  hVeins.forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(v[0][0], v[0][1]);
    for (let i = 1; i < v.length; i++) ctx.lineTo(v[i][0], v[i][1]);
    ctx.strokeStyle = "rgba(165, 120, 35, 0.82)";
    ctx.lineWidth = 2.0;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 235, 175, 0.72)";
    ctx.lineWidth = 0.85;
    ctx.stroke();
  });

  // Swallowtail amber jewel marking
  ctx.fillStyle = "rgba(175, 85, 25, 0.85)";
  ctx.beginPath();
  ctx.arc(310, 445, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
  return canvas;
}
