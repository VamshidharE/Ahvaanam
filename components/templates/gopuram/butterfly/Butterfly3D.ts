import * as THREE from "three";
import { createForewingCanvas, createHindwingCanvas } from "./ButterflyTexture";

export interface ButterflyInstance {
  group: THREE.Group;
  update: (delta: number, speed: number, isHovering: boolean) => void;
  dispose: () => void;
}

/**
 * Builds a wing geometry with pivot at (0,0,0) and an aerodynamic 3D camber curve.
 */
function buildWingGeometry(w: number, h: number, isForewing: boolean, side: number): THREE.BufferGeometry {
  const geom = new THREE.PlaneGeometry(w, h, 14, 14);
  const pos = geom.attributes.position;
  const uvs = geom.attributes.uv;

  // Move pivot point (0,0) to wing root
  const xShift = side * (w * 0.5);
  const yShift = isForewing ? h * 0.5 : -h * 0.5;
  geom.translate(xShift, yShift, 0);

  // Re-map UV and compute aerodynamic camber
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = side === 1 ? x / w : -x / w;
    const v = isForewing ? y / h : 1 - Math.abs(y) / h;
    uvs.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));

    // Living wing 3D camber (curved airfoil)
    const camber = Math.sin(Math.max(0, u) * Math.PI) * (isForewing ? 2.5 : 1.8);
    pos.setZ(i, camber);
  }
  geom.computeVertexNormals();
  return geom;
}

export function createButterfly(): ButterflyInstance {
  const butterflyGroup = new THREE.Group();

  // Shared Disposables
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // Materials
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x24160c,
    roughness: 0.35,
    metalness: 0.45,
  });
  disposables.push(bodyMat);

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.75,
  });
  disposables.push(goldAccentMat);

  // Anatomical Body Segments
  const bodyGroup = new THREE.Group();

  // Head
  const headGeom = new THREE.SphereGeometry(1.9, 12, 10);
  disposables.push(headGeom);
  const headMesh = new THREE.Mesh(headGeom, bodyMat);
  headMesh.position.set(0, 7.5, 0);
  headMesh.scale.set(1.0, 1.15, 0.9);
  bodyGroup.add(headMesh);

  // Black glistening eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x050403 });
  disposables.push(eyeMat);
  const eyeGeom = new THREE.SphereGeometry(0.65, 8, 8);
  disposables.push(eyeGeom);

  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.set(-1.1, 7.8, 0.6);
  bodyGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.set(1.1, 7.8, 0.6);
  bodyGroup.add(rightEye);

  // Curved Antennae with Gold Foil Tips
  const curveLeft = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 8.4, 0.2),
    new THREE.Vector3(-1.8, 12.0, 1.4),
    new THREE.Vector3(-3.2, 14.5, 2.0),
    new THREE.Vector3(-4.0, 15.0, 1.8),
  ]);
  const antLeftGeom = new THREE.TubeGeometry(curveLeft, 16, 0.16, 6, false);
  disposables.push(antLeftGeom);
  bodyGroup.add(new THREE.Mesh(antLeftGeom, bodyMat));

  const curveRight = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.4, 8.4, 0.2),
    new THREE.Vector3(1.8, 12.0, 1.4),
    new THREE.Vector3(3.2, 14.5, 2.0),
    new THREE.Vector3(4.0, 15.0, 1.8),
  ]);
  const antRightGeom = new THREE.TubeGeometry(curveRight, 16, 0.16, 6, false);
  disposables.push(antRightGeom);
  bodyGroup.add(new THREE.Mesh(antRightGeom, bodyMat));

  // Gold tips on antennae
  const tipGeom = new THREE.SphereGeometry(0.38, 8, 8);
  disposables.push(tipGeom);
  const leftTip = new THREE.Mesh(tipGeom, goldAccentMat);
  leftTip.position.set(-4.0, 15.0, 1.8);
  bodyGroup.add(leftTip);

  const rightTip = new THREE.Mesh(tipGeom, goldAccentMat);
  rightTip.position.set(4.0, 15.0, 1.8);
  bodyGroup.add(rightTip);

  // Thorax
  const thoraxGeom = new THREE.SphereGeometry(2.3, 14, 12);
  disposables.push(thoraxGeom);
  const thoraxMesh = new THREE.Mesh(thoraxGeom, bodyMat);
  thoraxMesh.position.set(0, 4.2, 0);
  thoraxMesh.scale.set(0.9, 1.45, 0.95);
  bodyGroup.add(thoraxMesh);

  // Abdomen
  const abdomenGeom = new THREE.CylinderGeometry(1.3, 0.45, 10, 12);
  disposables.push(abdomenGeom);
  const abdomenMesh = new THREE.Mesh(abdomenGeom, bodyMat);
  abdomenMesh.position.set(0, -3.2, -0.4);
  abdomenMesh.rotation.x = -0.06;
  bodyGroup.add(abdomenMesh);

  // Gold rings around abdomen
  for (let ring = 0; ring < 4; ring++) {
    const ringGeom = new THREE.TorusGeometry(1.2 - ring * 0.16, 0.12, 6, 16);
    disposables.push(ringGeom);
    const ringMesh = new THREE.Mesh(ringGeom, goldAccentMat);
    ringMesh.position.set(0, -0.8 - ring * 1.8, -0.4);
    ringMesh.rotation.x = Math.PI / 2;
    bodyGroup.add(ringMesh);
  }

  butterflyGroup.add(bodyGroup);

  // Wing Canvases & Canvas Textures
  const forewingCanvas = createForewingCanvas();
  const hindwingCanvas = createHindwingCanvas();

  const forewingTex = new THREE.CanvasTexture(forewingCanvas);
  forewingTex.colorSpace = THREE.SRGBColorSpace;
  disposables.push(forewingTex);

  const hindwingTex = new THREE.CanvasTexture(hindwingCanvas);
  hindwingTex.colorSpace = THREE.SRGBColorSpace;
  disposables.push(hindwingTex);

  const forewingMat = new THREE.MeshStandardMaterial({
    map: forewingTex,
    transparent: true,
    opacity: 0.97,
    side: THREE.DoubleSide,
    roughness: 0.38,
    metalness: 0.18,
    alphaTest: 0.05,
  });
  disposables.push(forewingMat);

  const hindwingMat = new THREE.MeshStandardMaterial({
    map: hindwingTex,
    transparent: true,
    opacity: 0.97,
    side: THREE.DoubleSide,
    roughness: 0.38,
    metalness: 0.18,
    alphaTest: 0.05,
  });
  disposables.push(hindwingMat);

  // 4 Wings with Independent Rotation Anchors
  const wingSpan = 26;
  const forewingH = 24;
  const hindwingH = 20;

  // 1. Right Forewing
  const rfGeom = buildWingGeometry(wingSpan, forewingH, true, 1);
  disposables.push(rfGeom);
  const rightForewing = new THREE.Mesh(rfGeom, forewingMat);
  rightForewing.position.set(1.2, 5.0, 0.8);
  rightForewing.rotation.set(0.12, 0, -0.08);
  butterflyGroup.add(rightForewing);

  // 2. Left Forewing (mirrored along X)
  const lfGeom = buildWingGeometry(wingSpan, forewingH, true, -1);
  disposables.push(lfGeom);
  const leftForewing = new THREE.Mesh(lfGeom, forewingMat);
  leftForewing.position.set(-1.2, 5.0, 0.8);
  leftForewing.rotation.set(0.12, 0, 0.08);
  butterflyGroup.add(leftForewing);

  // 3. Right Hindwing
  const rhGeom = buildWingGeometry(wingSpan * 0.85, hindwingH, false, 1);
  disposables.push(rhGeom);
  const rightHindwing = new THREE.Mesh(rhGeom, hindwingMat);
  rightHindwing.position.set(1.0, 3.2, 0.4);
  rightHindwing.rotation.set(-0.06, 0, -0.15);
  butterflyGroup.add(rightHindwing);

  // 4. Left Hindwing
  const lhGeom = buildWingGeometry(wingSpan * 0.85, hindwingH, false, -1);
  disposables.push(lhGeom);
  const leftHindwing = new THREE.Mesh(lhGeom, hindwingMat);
  leftHindwing.position.set(-1.0, 3.2, 0.4);
  leftHindwing.rotation.set(-0.06, 0, 0.15);
  butterflyGroup.add(leftHindwing);

  // Flapping Phase Animation
  let flapTime = 0;

  const update = (delta: number, speed: number, isHovering: boolean) => {
    // Dynamic flap frequency: calm gliding (9 rad/s) up to energetic flutter (26 rad/s)
    const baseFreq = isHovering ? 20.0 : 10.0;
    const speedMultiplier = THREE.MathUtils.clamp(speed * 0.06, 0.7, 2.2);
    const flapFreq = baseFreq * speedMultiplier;

    flapTime += delta * flapFreq;

    // Organic asymmetrical flap stroke (fast downstroke, graceful recovery upstroke)
    const flapWave = Math.sin(flapTime);
    const asymmetricalWave = Math.pow(Math.max(0, flapWave), 0.8) - Math.pow(Math.max(0, -flapWave), 1.2);

    const flapAngle = asymmetricalWave * (isHovering ? 0.95 : 0.75);
    const hindwingLag = 0.22; // Natural delay between fore and hind wings

    // Right wings fold up (+Y rotation) on upstroke
    rightForewing.rotation.y = flapAngle;
    leftForewing.rotation.y = -flapAngle;

    const hindFlap = Math.sin(flapTime - hindwingLag) * (isHovering ? 0.85 : 0.65);
    rightHindwing.rotation.y = hindFlap;
    leftHindwing.rotation.y = -hindFlap;

    // Subtle pitch dip during stroke (flight thrust)
    butterflyGroup.position.z = Math.sin(flapTime * 2) * 2.2;
    bodyGroup.rotation.x = Math.sin(flapTime) * 0.12;
  };

  const dispose = () => {
    for (const item of disposables) {
      if ("dispose" in item && typeof item.dispose === "function") {
        item.dispose();
      }
    }
  };

  return { group: butterflyGroup, update, dispose };
}
