import * as THREE from "three";
import { createForewingCanvas, createHindwingCanvas } from "./ButterflyTexture";

export interface ButterflyInstance {
  group: THREE.Group;
  update: (delta: number, speed: number, isHovering: boolean) => void;
  dispose: () => void;
}

/**
 * Builds a wing geometry with pivot at (0,0,0) and an aerodynamic 3D camber curve.
 * @param w Width of wing in world units
 * @param h Height of wing in world units
 * @param isForewing True if forewing, false if hindwing
 * @param side +1 for Right wing (+X), -1 for Left wing (-X)
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

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x060402,
    roughness: 0.1,
    metalness: 0.9,
  });
  disposables.push(eyeMat);

  // Anatomical Body Group
  const bodyGroup = new THREE.Group();
  butterflyGroup.add(bodyGroup);

  // 1. Head
  const headGeom = new THREE.SphereGeometry(2.2, 16, 16);
  disposables.push(headGeom);
  const head = new THREE.Mesh(headGeom, bodyMat);
  head.scale.set(1, 1.1, 0.9);
  head.position.set(0, 7.5, 0);
  bodyGroup.add(head);

  // 2. Eyes
  const eyeGeom = new THREE.SphereGeometry(0.85, 12, 12);
  disposables.push(eyeGeom);
  const eyeL = new THREE.Mesh(eyeGeom, eyeMat);
  eyeL.position.set(-1.4, 7.9, 0.8);
  bodyGroup.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeom, eyeMat);
  eyeR.position.set(1.4, 7.9, 0.8);
  bodyGroup.add(eyeR);

  // 3. Antennae
  function createAntenna(side: number): THREE.Group {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.7, 8.5, 0.8),
      new THREE.Vector3(side * 2.2, 13, 2.5),
      new THREE.Vector3(side * 4.5, 17, 3.5),
      new THREE.Vector3(side * 6.0, 20, 2.0)
    );
    const tubeGeom = new THREE.TubeGeometry(curve, 16, 0.18, 8, false);
    disposables.push(tubeGeom);
    const tube = new THREE.Mesh(tubeGeom, goldAccentMat);

    const tipGeom = new THREE.SphereGeometry(0.5, 8, 8);
    disposables.push(tipGeom);
    const tip = new THREE.Mesh(tipGeom, goldAccentMat);
    tip.position.copy(curve.getPoint(1));

    const grp = new THREE.Group();
    grp.add(tube);
    grp.add(tip);
    return grp;
  }
  bodyGroup.add(createAntenna(-1));
  bodyGroup.add(createAntenna(1));

  // 4. Thorax
  const thoraxGeom = new THREE.SphereGeometry(3.0, 16, 16);
  disposables.push(thoraxGeom);
  const thorax = new THREE.Mesh(thoraxGeom, bodyMat);
  thorax.scale.set(0.9, 1.5, 0.8);
  thorax.position.set(0, 2.5, -0.2);
  bodyGroup.add(thorax);

  // 5. Abdomen
  const abdomenGeom = new THREE.CylinderGeometry(1.5, 0.5, 16, 16);
  disposables.push(abdomenGeom);
  const abdomen = new THREE.Mesh(abdomenGeom, bodyMat);
  abdomen.scale.set(0.85, 1, 0.75);
  abdomen.position.set(0, -7.5, -0.8);
  abdomen.rotation.x = -0.15;
  bodyGroup.add(abdomen);

  // 6. Six Delicate Legs
  function createLegs(): THREE.Group {
    const legGroup = new THREE.Group();
    const yPositions = [4.2, 2.5, 0.8];
    yPositions.forEach((yPos) => {
      [-1, 1].forEach((side) => {
        const curve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(side * 1.4, yPos, -1.2),
          new THREE.Vector3(side * 3.0, yPos - 1.2, -2.4),
          new THREE.Vector3(side * 3.6, yPos - 3.5, -3.0),
          new THREE.Vector3(side * 2.6, yPos - 5.0, -3.4)
        );
        const legGeom = new THREE.TubeGeometry(curve, 8, 0.12, 6, false);
        disposables.push(legGeom);
        const leg = new THREE.Mesh(legGeom, goldAccentMat);
        legGroup.add(leg);
      });
    });
    return legGroup;
  }
  bodyGroup.add(createLegs());

  // Wing Textures & Materials
  const foreTex = new THREE.CanvasTexture(createForewingCanvas());
  foreTex.colorSpace = THREE.SRGBColorSpace;
  disposables.push(foreTex);

  const hindTex = new THREE.CanvasTexture(createHindwingCanvas());
  hindTex.colorSpace = THREE.SRGBColorSpace;
  disposables.push(hindTex);

  const foreMat = new THREE.MeshStandardMaterial({
    map: foreTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.35,
    metalness: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    alphaTest: 0.05,
  });
  disposables.push(foreMat);

  const hindMat = new THREE.MeshStandardMaterial({
    map: hindTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.35,
    metalness: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    alphaTest: 0.05,
  });
  disposables.push(hindMat);

  // Geometries for Forewings & Hindwings
  const rightForeGeom = buildWingGeometry(34, 40, true, 1);
  const leftForeGeom = buildWingGeometry(34, 40, true, -1);
  const rightHindGeom = buildWingGeometry(28, 32, false, 1);
  const leftHindGeom = buildWingGeometry(28, 32, false, -1);
  disposables.push(rightForeGeom, leftForeGeom, rightHindGeom, leftHindGeom);

  // WING GROUPS & HINGES
  const rightForeGroup = new THREE.Group();
  rightForeGroup.position.set(1.1, 4.0, 0.4);
  rightForeGroup.add(new THREE.Mesh(rightForeGeom, foreMat));
  butterflyGroup.add(rightForeGroup);

  const leftForeGroup = new THREE.Group();
  leftForeGroup.position.set(-1.1, 4.0, 0.4);
  leftForeGroup.add(new THREE.Mesh(leftForeGeom, foreMat));
  butterflyGroup.add(leftForeGroup);

  const rightHindGroup = new THREE.Group();
  rightHindGroup.position.set(1.0, 2.5, -0.2);
  rightHindGroup.add(new THREE.Mesh(rightHindGeom, hindMat));
  butterflyGroup.add(rightHindGroup);

  const leftHindGroup = new THREE.Group();
  leftHindGroup.position.set(-1.0, 2.5, -0.2);
  leftHindGroup.add(new THREE.Mesh(leftHindGeom, hindMat));
  butterflyGroup.add(leftHindGroup);

  // Flapping Animation State
  let flapPhase = 0;
  let glideTimer = 0;
  let isGliding = false;

  function update(delta: number, speed: number, isHovering: boolean) {
    // Dynamic flap frequency: faster when travelling/accelerating, softer when hovering
    const baseFreq = isHovering ? 20 : 28 + Math.min(speed * 0.08, 16);
    flapPhase += delta * baseFreq;

    // In hovering mode, randomly introduce short graceful gliding pauses
    if (isHovering) {
      glideTimer += delta;
      if (!isGliding && glideTimer > 2.0 && Math.random() < 0.03) {
        isGliding = true;
        glideTimer = 0;
      } else if (isGliding && glideTimer > 0.45) {
        isGliding = false;
        glideTimer = 0;
      }
    } else {
      isGliding = false;
      glideTimer = 0;
    }

    let flapAngle: number;
    if (isGliding) {
      // Wings held in a graceful open V-shape
      flapAngle = 0.35 + Math.sin(flapPhase * 0.2) * 0.05;
    } else {
      // Natural flapping stroke: rapid downstroke, smooth upstroke
      const rawSine = Math.sin(flapPhase);
      // Asymmetric power stroke: more time in open position, fast snap upward
      flapAngle = Math.pow(Math.abs(rawSine), 1.2) * Math.sign(rawSine) * 0.95;
    }

    // Micro-asymmetry between left and right wings (avoid robot mirror)
    const leftAsymmetry = 1.0 + Math.sin(flapPhase * 0.4) * 0.05;
    const rightAsymmetry = 1.0 - Math.cos(flapPhase * 0.4) * 0.05;

    // Forewing leads by a slight phase
    const forePhaseLead = 0.12;
    const foreFlap = flapAngle * 1.05 + forePhaseLead;
    const hindFlap = flapAngle * 0.92;

    // Apply wing hinge rotation around Y axis
    rightForeGroup.rotation.y = -foreFlap * rightAsymmetry;
    leftForeGroup.rotation.y = foreFlap * leftAsymmetry;

    rightHindGroup.rotation.y = -hindFlap * rightAsymmetry;
    leftHindGroup.rotation.y = hindFlap * leftAsymmetry;

    // Angle of Attack torsion along wing X axis during flapping
    const torsion = Math.cos(flapPhase) * 0.12;
    rightForeGroup.rotation.x = torsion;
    leftForeGroup.rotation.x = torsion;
    rightHindGroup.rotation.x = torsion * 0.8;
    leftHindGroup.rotation.x = torsion * 0.8;

    // Micro-bob on body: body remains comparatively stable, with tiny vertical hop
    bodyGroup.position.z = Math.sin(flapPhase) * 0.4;
    bodyGroup.rotation.x = -Math.cos(flapPhase) * 0.03;
  }

  function dispose() {
    disposables.forEach((item) => {
      if ("dispose" in item && typeof item.dispose === "function") {
        item.dispose();
      }
    });
  }

  return {
    group: butterflyGroup,
    update,
    dispose,
  };
}
