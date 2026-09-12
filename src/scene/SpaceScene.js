/**
 * SpaceScene.js
 * Ultra-Aesthetic Procedural 3D Cosmic Space Environment.
 * 40,000+ scintillating stars, shooting meteors, volumetric cosmic nebula dust,
 * dynamic neural constellation lattice, fluid quantum particle wave, and relativistic warp speed.
 * 100% pure procedural Three.js WebGL & GLSL - ZERO static pictures.
 */

import * as THREE from 'three';

export class SpaceScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // Mouse coordinates with silky inertia
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    this.shootingStars = [];
    this.lastShootingStarTime = 0;

    this.initRenderer();
    this.initScene();
    this.initCamera();

    // 1. Massive Multi-Layered Starfields (Space ke andar ke stars se bhar diya)
    this.createDeepCosmicStarfield();
    this.createBrightGlowStars();
    this.createNebulaDustClouds();
    this.createShootingStars();
    this.createStardustCursorTrail();

    // 2. Journey Stages (Smoothly revealed ONLY during their respective scroll sections)
    this.createNeuralLattice();
    this.createQuantumParticleWave();
    this.createPerspectiveHighway();
    this.createCosmicHorizonBeam();

    this.attachEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Pure pitch black cosmic abyss
    this.scene.fog = new THREE.FogExp2(0x000104, 0.0006);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      54,
      window.innerWidth / window.innerHeight,
      0.1,
      4500
    );
    this.camera.position.set(0, 0, 100);
  }

  // ================= 1. DEEP COSMIC STARFIELD (38,000+ Multi-Spectral Stars) =================
  createDeepCosmicStarfield() {
    const starCount = 38000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const twinkleData = new Float32Array(starCount * 2);

    const palette = [
      new THREE.Color(0xffffff), // Diamond white
      new THREE.Color(0xe0f2fe), // Icy celestial blue
      new THREE.Color(0x00f5ff), // Electric neon cyan
      new THREE.Color(0x38bdf8), // Radiant azure
      new THREE.Color(0x818cf8), // Soft indigo
      new THREE.Color(0xfde047), // Solar gold
      new THREE.Color(0xfbbf24), // Warm topaz
      new THREE.Color(0xc084fc), // Celestial lilac
      new THREE.Color(0x6ee7b7)  // Emerald star
    ];

    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(130, 2600);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Natural star magnitude variation
      sizes[i] = THREE.MathUtils.randFloat(1.6, 3.8);

      // Multi-harmonic twinkling
      twinkleData[i * 2] = THREE.MathUtils.randFloat(0.8, 2.4); // Frequency
      twinkleData[i * 2 + 1] = THREE.MathUtils.randFloat(0, Math.PI * 2); // Phase
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkleData, 2));

    this.deepStarsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute vec3 color;
        attribute float size;
        attribute vec2 aTwinkle;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          float freq = aTwinkle.x;
          float phase = aTwinkle.y;

          // Multi-harmonic gentle organic sparkle (vibrant & living)
          float twinkle1 = sin(uTime * freq + phase);
          float twinkle2 = sin(uTime * (freq * 1.6) + phase * 2.1);
          float twinkle = 0.72 + 0.28 * (twinkle1 * 0.7 + twinkle2 * 0.3);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depth = -mvPosition.z;

          // Camera Proximity Near-Fade: smoothly dissolves before hitting camera plane
          // Full brightness everywhere except directly in front of the lens
          float nearFade = smoothstep(45.0, 130.0, depth);
          if (depth <= 2.0) {
            nearFade = 0.0;
          }

          vAlpha = twinkle * nearFade;

          // Size scaling clamped strictly to realistic astronomical pinpricks
          float pSize = size * uPixelRatio * (280.0 / max(depth, 90.0));
          gl_PointSize = clamp(pSize, 1.4, 5.6);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          if (vAlpha <= 0.005) discard;
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Brilliant luminous optical star disc
          float core = 1.0 - (dist * 2.0);
          float intensity = (pow(core, 1.5) * 0.85 + pow(core, 3.8) * 0.75) * vAlpha;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.deepStars = new THREE.Points(geometry, this.deepStarsMaterial);
    this.scene.add(this.deepStars);
  }

  // ================= 2. LUMINOUS CELESTIAL STARS (4,200 Prominent Diamond Stars) =================
  createBrightGlowStars() {
    const heroCount = 4200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(heroCount * 3);
    const colors = new Float32Array(heroCount * 3);
    const sizes = new Float32Array(heroCount);
    const sparkle = new Float32Array(heroCount * 2);

    const brightPalette = [
      new THREE.Color(0xffffff), // Supernova white
      new THREE.Color(0x00f5ff), // High-intensity cyan
      new THREE.Color(0x38bdf8), // Electric sky
      new THREE.Color(0xfef08a), // Golden star
      new THREE.Color(0xf472b6), // Celestial rose
      new THREE.Color(0xa855f7)  // Deep ultraviolet
    ];

    for (let i = 0; i < heroCount; i++) {
      const r = THREE.MathUtils.randFloat(160, 2400);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const col = brightPalette[Math.floor(Math.random() * brightPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Prominent diamond sizes
      sizes[i] = THREE.MathUtils.randFloat(3.2, 6.2);
      sparkle[i * 2] = THREE.MathUtils.randFloat(0.7, 2.0);
      sparkle[i * 2 + 1] = THREE.MathUtils.randFloat(0, Math.PI * 2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkle, 2));

    this.glowStarsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute vec3 color;
        attribute float size;
        attribute vec2 aSparkle;
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          vColor = color;
          float spd = aSparkle.x;
          float phase = aSparkle.y;

          // Living celestial breathing (steady, vibrant shimmer)
          float p1 = sin(uTime * spd + phase);
          float p2 = sin(uTime * (spd * 2.2) + phase * 1.7);
          float pulse = 0.78 + 0.22 * (p1 * 0.75 + p2 * 0.25);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float depth = -mvPosition.z;

          // Near camera graceful fade out: vanishes without blocking UI
          float nearFade = smoothstep(50.0, 140.0, depth);
          if (depth <= 2.0) {
            nearFade = 0.0;
          }

          vGlow = pulse * nearFade;

          // Refined distinct star point size (never oversized flares, always sharp stars)
          float pSize = size * uPixelRatio * (320.0 / max(depth, 100.0));
          gl_PointSize = clamp(pSize, 2.2, 8.8);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vGlow;

        void main() {
          if (vGlow <= 0.005) discard;
          vec2 p = gl_PointCoord - vec2(0.5);
          float d = length(p);
          if (d > 0.5) discard;

          // True astronomical optical profile:
          // 1. Brilliant diamond central core
          float core = exp(-d * d * 22.0) * 1.45;
          // 2. Delicate luminous corona
          float corona = pow(max(0.0, 1.0 - d * 2.0), 2.2) * 0.65;
          float intensity = (core + corona) * vGlow;

          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.glowStars = new THREE.Points(geometry, this.glowStarsMaterial);
    this.scene.add(this.glowStars);
  }

  // ================= 3. VOLUMETRIC GALACTIC NEBULA DUST (Atmospheric Depth) =================
  createNebulaDustClouds() {
    const cloudCount = 3600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(cloudCount * 3);
    const colors = new Float32Array(cloudCount * 3);
    const sizes = new Float32Array(cloudCount);

    const nebulaColors = [
      new THREE.Color(0x0284c7), // Deep cyan
      new THREE.Color(0x4f46e5), // Royal indigo
      new THREE.Color(0x0e7490), // Cosmic teal
      new THREE.Color(0x312e81), // Midnight purple
      new THREE.Color(0x701a75), // Deep cosmic violet
      new THREE.Color(0x0891b2), // Vivid turquoise
      new THREE.Color(0x92400e)  // Warm stellar amber dust
    ];

    for (let i = 0; i < cloudCount; i++) {
      const radius = THREE.MathUtils.randFloat(250, 2200);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(Math.PI * 0.15, Math.PI * 0.85);

      // Organic spiral density distribution
      const spiralOffset = Math.sin(theta * 3.0) * 80;
      positions[i * 3] = (radius + spiralOffset) * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.45; // Galactic plane
      positions[i * 3 + 2] = (radius + spiralOffset) * Math.cos(phi);

      const col = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = THREE.MathUtils.randFloat(55.0, 160.0);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute vec3 color;
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Slow organic breathing of celestial clouds
          float breath = sin(uTime * 0.15 + pos.x * 0.003) * cos(uTime * 0.12 + pos.z * 0.003);
          pos.y += breath * 18.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float depth = -mvPosition.z;
          
          // Near fade for nebula to avoid fogging right at the lens
          float nearFade = smoothstep(120.0, 320.0, depth);
          vAlpha = nearFade * 0.18;

          gl_PointSize = size * uPixelRatio * (280.0 / max(depth, 140.0));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // Multi-layer ethereal interstellar gas glow
          float gas = pow(1.0 - (dist * 2.0), 3.0) * vAlpha;
          gl_FragColor = vec4(vColor, gas);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.nebulaMesh = new THREE.Points(geometry, this.nebulaMaterial);
    this.scene.add(this.nebulaMesh);
  }

  // ================= 4. PROCEDURAL SHOOTING STARS / METEORS =================
  createShootingStars() {
    this.shootingStarCount = 8;
    this.shootingStars = [];
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.shootingStarCount * 6); // 2 points per line

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.shootingStarMaterial = new THREE.LineBasicMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });

    this.shootingStarLines = new THREE.LineSegments(geom, this.shootingStarMaterial);
    this.scene.add(this.shootingStarLines);

    for (let i = 0; i < this.shootingStarCount; i++) {
      this.resetShootingStar(i, true);
    }
  }

  resetShootingStar(index, initial = false) {
    const angle = THREE.MathUtils.randFloat(-Math.PI * 0.3, Math.PI * 0.3);
    const x = THREE.MathUtils.randFloat(-700, 700);
    const y = THREE.MathUtils.randFloat(180, 700);
    const z = THREE.MathUtils.randFloat(-900, -150);

    const speed = THREE.MathUtils.randFloat(45, 75);
    const length = THREE.MathUtils.randFloat(90, 190);

    this.shootingStars[index] = {
      x, y, z,
      vx: Math.cos(angle) * -speed,
      vy: Math.sin(angle) * -speed,
      vz: speed * 0.35,
      length,
      active: !initial && Math.random() > 0.4,
      life: 0,
      maxLife: THREE.MathUtils.randFloat(0.9, 1.8),
      delay: THREE.MathUtils.randFloat(1.2, 5.0)
    };
  }

  updateShootingStars(delta) {
    if (!this.shootingStars) return;
    const positions = this.shootingStarLines.geometry.attributes.position.array;
    let anyActive = false;

    for (let i = 0; i < this.shootingStarCount; i++) {
      const star = this.shootingStars[i];

      if (!star.active) {
        star.delay -= delta;
        if (star.delay <= 0) {
          star.active = true;
          star.life = 0;
        }
      }

      if (star.active) {
        anyActive = true;
        star.life += delta;
        star.x += star.vx * delta * 60;
        star.y += star.vy * delta * 60;
        star.z += star.vz * delta * 60;

        const pIdx = i * 6;
        positions[pIdx] = star.x;
        positions[pIdx + 1] = star.y;
        positions[pIdx + 2] = star.z;

        const tailFactor = star.length;
        positions[pIdx + 3] = star.x - (star.vx / 40) * tailFactor;
        positions[pIdx + 4] = star.y - (star.vy / 40) * tailFactor;
        positions[pIdx + 5] = star.z - (star.vz / 40) * tailFactor;

        if (star.life >= star.maxLife) {
          this.resetShootingStar(i);
        }
      }
    }

    this.shootingStarLines.geometry.attributes.position.needsUpdate = true;
    this.shootingStarMaterial.opacity = anyActive ? 0.85 : 0.0;
  }

  // ================= 4B. INTERACTIVE STARDUST CURSOR TRAIL (Unique Cosmic Aura) =================
  createStardustCursorTrail() {
    this.stardustCount = 160;
    this.stardustParticles = [];
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.stardustCount * 3);
    const colors = new Float32Array(this.stardustCount * 3);
    const sizes = new Float32Array(this.stardustCount);

    const colorsPalette = [
      new THREE.Color(0x00f5ff), // Electric cyan
      new THREE.Color(0xffffff), // Diamond white
      new THREE.Color(0x818cf8), // Soft indigo
      new THREE.Color(0x38bdf8), // Celestial ice
      new THREE.Color(0xf472b6), // Cosmic rose
      new THREE.Color(0xfde047)  // Solar gold
    ];

    for (let i = 0; i < this.stardustCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 2000; // Park offscreen initially

      const col = colorsPalette[i % colorsPalette.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 0;

      this.stardustParticles.push({
        x: 0, y: 0, z: 2000,
        vx: 0, vy: 0, vz: 0,
        life: 0,
        maxLife: 1.0,
        active: false,
        baseSize: 0
      });
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.stardustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uPixelRatio;
        attribute vec3 color;
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vAlpha = smoothstep(0.0, 0.2, size) * (1.0 - smoothstep(0.8, 1.0, size / 8.0));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (280.0 / max(-mvPosition.z, 20.0));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          if (vAlpha <= 0.01) discard;
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - dist * 2.0, 2.0) * vAlpha;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stardustPoints = new THREE.Points(geom, this.stardustMaterial);
    this.scene.add(this.stardustPoints);
    this.stardustNextIndex = 0;
  }

  updateStardustTrail(delta) {
    if (!this.stardustParticles) return;

    // Project mouse coordinates to 3D world plane in front of camera
    const aspect = window.innerWidth / window.innerHeight;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const distInFront = 48;
    const heightAtDist = 2 * Math.tan(fovRad / 2) * distInFront;
    const widthAtDist = heightAtDist * aspect;

    const targetX = this.camera.position.x + (this.mouse.x * (widthAtDist / 2));
    const targetY = this.camera.position.y + (this.mouse.y * (heightAtDist / 2));
    const targetZ = this.camera.position.z - distInFront;

    const dx = targetX - (this.lastWorldMouseX || targetX);
    const dy = targetY - (this.lastWorldMouseY || targetY);
    const speed = Math.sqrt(dx * dx + dy * dy);
    this.lastWorldMouseX = targetX;
    this.lastWorldMouseY = targetY;

    // Spawn 2-3 stardust sparks when mouse moves
    const spawnCount = Math.min(3, Math.floor(speed * 0.7) + (Math.random() > 0.4 ? 1 : 0));
    for (let s = 0; s < spawnCount; s++) {
      const p = this.stardustParticles[this.stardustNextIndex];
      const spread = 0.6;
      p.x = targetX + THREE.MathUtils.randFloatSpread(spread);
      p.y = targetY + THREE.MathUtils.randFloatSpread(spread);
      p.z = targetZ + THREE.MathUtils.randFloatSpread(spread);

      const angle = Math.random() * Math.PI * 2;
      const vMag = THREE.MathUtils.randFloat(0.4, 1.8);
      p.vx = Math.cos(angle) * vMag + (dx * 0.12);
      p.vy = Math.sin(angle) * vMag + (dy * 0.12);
      p.vz = THREE.MathUtils.randFloat(-0.4, 0.4);

      p.life = 0;
      p.maxLife = THREE.MathUtils.randFloat(0.7, 1.3);
      p.active = true;
      p.baseSize = THREE.MathUtils.randFloat(3.0, 6.5);

      this.stardustNextIndex = (this.stardustNextIndex + 1) % this.stardustCount;
    }

    const posArr = this.stardustPoints.geometry.attributes.position.array;
    const sizeArr = this.stardustPoints.geometry.attributes.size.array;

    for (let i = 0; i < this.stardustCount; i++) {
      const p = this.stardustParticles[i];
      if (p.active) {
        p.life += delta;
        const progress = p.life / p.maxLife;

        if (progress >= 1.0) {
          p.active = false;
          posArr[i * 3 + 2] = 2000;
          sizeArr[i] = 0;
        } else {
          p.x += p.vx * delta * 60;
          p.y += p.vy * delta * 60;
          p.z += p.vz * delta * 60;

          p.vx *= 0.95;
          p.vy *= 0.95;

          posArr[i * 3] = p.x;
          posArr[i * 3 + 1] = p.y;
          posArr[i * 3 + 2] = p.z;

          // Parabolic scale curve (grow then vanish)
          const scale = Math.sin(progress * Math.PI);
          sizeArr[i] = p.baseSize * scale;
        }
      }
    }

    this.stardustPoints.geometry.attributes.position.needsUpdate = true;
    this.stardustPoints.geometry.attributes.size.needsUpdate = true;
  }

  // ================= 5. DYNAMIC NEURAL LATTICE (PATTERNS - Opacity 0 at Landing) =================
  createNeuralLattice() {
    this.latticeGroup = new THREE.Group();
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    this.latticeNodes = [];

    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(220);
      const y = THREE.MathUtils.randFloatSpread(120);
      const z = THREE.MathUtils.randFloatSpread(180);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.latticeNodes.push({
        x, y, z,
        vx: THREE.MathUtils.randFloatSpread(0.06),
        vy: THREE.MathUtils.randFloatSpread(0.06),
        vz: THREE.MathUtils.randFloatSpread(0.06)
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.latticePointsMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 4.8,
      transparent: true,
      opacity: 0.0, // Hidden at landing
      blending: THREE.AdditiveBlending
    });
    this.latticePoints = new THREE.Points(geometry, this.latticePointsMat);
    this.latticeGroup.add(this.latticePoints);

    const maxLines = count * 8;
    const linePos = new Float32Array(maxLines * 6);
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.0, // Hidden at landing
      blending: THREE.AdditiveBlending
    });
    this.latticeLines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.latticeGroup.add(this.latticeLines);

    this.latticeGroup.position.set(0, 0, -480);
    this.scene.add(this.latticeGroup);
  }

  // ================= 6. QUANTUM PARTICLE WAVE (INTELLIGENCE - Opacity 0 at Landing) =================
  createQuantumParticleWave() {
    const cols = 90;
    const rows = 90;
    const total = cols * rows;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);

    const c1 = new THREE.Color(0x00f5ff);
    const c2 = new THREE.Color(0x6366f1);

    let idx = 0;
    const spacing = 4.2;
    const halfW = (cols * spacing) / 2;
    const halfD = (rows * spacing) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        positions[idx * 3] = i * spacing - halfW;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = j * spacing - halfD;

        const mix = Math.sin((i / cols) * Math.PI) * Math.cos((j / rows) * Math.PI);
        const col = c1.clone().lerp(c2, Math.abs(mix));
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.0 } // Hidden at landing
      },
      vertexShader: `
        uniform float uTime;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec3 pos = position;

          float w1 = sin(pos.x * 0.035 + uTime * 1.8) * cos(pos.z * 0.035 + uTime * 1.4);
          float w2 = sin(pos.x * 0.06 - uTime * 2.0) * sin(pos.z * 0.05 + uTime * 1.6);
          float elev = (w1 * 26.0) + (w2 * 12.0);
          pos.y += elev;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (4.0 + elev * 0.06) * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float glow = pow(1.0 - (dist * 2.0), 1.8);
          gl_FragColor = vec4(vColor, glow * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.wavePoints = new THREE.Points(geometry, this.waveMaterial);
    this.wavePoints.position.set(0, -25, -950);
    this.scene.add(this.wavePoints);
  }

  // ================= 7. PERSPECTIVE DATA HIGHWAYS (WHAT'S NEXT?) =================
  createPerspectiveHighway() {
    this.highwayGroup = new THREE.Group();
    const trackCount = 60;

    for (let i = 0; i < trackCount; i++) {
      const curvePoints = [];
      const isRightOrange = i > trackCount * 0.65;
      const xSpread = THREE.MathUtils.randFloatSpread(260);

      for (let step = 0; step <= 20; step++) {
        const t = step / 20;
        const z = -600 + t * 450;
        const converge = 1.0 - t;
        const x = xSpread * converge * converge;
        const y = -15 + Math.sin(t * Math.PI) * 5;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }

      const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const color = isRightOrange ? 0xff9838 : 0x38bdf8;
      const mat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.0, // Hidden at landing
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(curveGeom, mat);
      this.highwayGroup.add(line);
    }

    this.highwayGroup.position.set(0, 0, -1400);
    this.scene.add(this.highwayGroup);
  }

  // ================= 8. CELESTIAL HORIZON BEAM (POSSIBILITY & SEE WHAT COMES NEXT) =================
  createCosmicHorizonBeam() {
    this.horizonBeamGroup = new THREE.Group();

    const streakGeom = new THREE.PlaneGeometry(1600, 18);
    const streakMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xff9838) },
        uAlpha: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uAlpha;
        varying vec2 vUv;

        void main() {
          float xDist = abs(vUv.x - 0.5) * 2.0;
          float yDist = abs(vUv.y - 0.5) * 2.0;
          float intensity = pow(1.0 - xDist, 2.5) * pow(1.0 - yDist, 4.0);
          gl_FragColor = vec4(uColor, intensity * uAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.beamMesh = new THREE.Mesh(streakGeom, streakMat);
    this.horizonBeamGroup.add(this.beamMesh);

    this.horizonBeamGroup.position.set(0, -15, -1200);
    this.scene.add(this.horizonBeamGroup);
  }

  // ================= EVENT LISTENERS =================
  attachEvents() {
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);

      const ratio = Math.min(window.devicePixelRatio, 2);
      if (this.deepStarsMaterial) this.deepStarsMaterial.uniforms.uPixelRatio.value = ratio;
      if (this.glowStarsMaterial) this.glowStarsMaterial.uniforms.uPixelRatio.value = ratio;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScrollProgress = total > 0 ? window.scrollY / total : 0;
    });
  }

  updateLattice() {
    if (!this.latticeNodes) return;
    const positions = this.latticePoints.geometry.attributes.position.array;

    for (let i = 0; i < this.latticeNodes.length; i++) {
      const n = this.latticeNodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;

      if (Math.abs(n.x) > 110) n.vx *= -1;
      if (Math.abs(n.y) > 60) n.vy *= -1;
      if (Math.abs(n.z) > 90) n.vz *= -1;

      positions[i * 3] = n.x;
      positions[i * 3 + 1] = n.y;
      positions[i * 3 + 2] = n.z;
    }
    this.latticePoints.geometry.attributes.position.needsUpdate = true;

    const lineArr = this.lineGeometry.attributes.position.array;
    let idx = 0;
    const threshold = 42;

    for (let i = 0; i < this.latticeNodes.length; i++) {
      for (let j = i + 1; j < this.latticeNodes.length; j++) {
        const dx = this.latticeNodes[i].x - this.latticeNodes[j].x;
        const dy = this.latticeNodes[i].y - this.latticeNodes[j].y;
        const dz = this.latticeNodes[i].z - this.latticeNodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold && idx < lineArr.length - 6) {
          lineArr[idx++] = this.latticeNodes[i].x;
          lineArr[idx++] = this.latticeNodes[i].y;
          lineArr[idx++] = this.latticeNodes[i].z;

          lineArr[idx++] = this.latticeNodes[j].x;
          lineArr[idx++] = this.latticeNodes[j].y;
          lineArr[idx++] = this.latticeNodes[j].z;
        }
      }
    }
    this.lineGeometry.setDrawRange(0, idx / 3);
    this.lineGeometry.attributes.position.needsUpdate = true;
  }

  // ================= MAIN ANIMATION LOOP =================
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Silky smooth interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.045;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.045;

    // 1. Scintillating Starfields Time Update
    if (this.deepStarsMaterial) this.deepStarsMaterial.uniforms.uTime.value = time;
    if (this.glowStarsMaterial) this.glowStarsMaterial.uniforms.uTime.value = time;

    // Slow celestial rotation creating living universe
    if (this.deepStars) {
      this.deepStars.rotation.y = time * 0.01;
      this.deepStars.rotation.x = time * 0.005;
    }
    if (this.glowStars) {
      this.glowStars.rotation.y = time * 0.015;
      this.glowStars.rotation.x = time * 0.007;
    }
    if (this.nebulaMesh) {
      this.nebulaMesh.rotation.y = time * 0.006;
      if (this.nebulaMaterial) {
        this.nebulaMaterial.uniforms.uTime.value = time;
      }
    }

    // 2. Shooting Stars & Interactive Stardust Trail
    this.updateShootingStars(delta);
    this.updateStardustTrail(delta);

    // 3. Dynamic Wave Mesh
    if (this.wavePoints && this.waveMaterial) {
      this.waveMaterial.uniforms.uTime.value = time;
    }

    this.updateLattice();

    // 4. Camera Flight & Stage Reveal Choreography
    const p = this.scrollProgress;
    const targetZ = 100 - (p * 1350);
    const targetY = -(p * 35) + (Math.sin(p * Math.PI) * 10);

    // Responsive 3D Parallax with mouse
    this.camera.position.z = targetZ;
    this.camera.position.y = targetY + (this.mouse.y * 6);
    this.camera.position.x = this.mouse.x * 12;

    // Reveal stages ONLY when scrolling into them (Hero remains pristine starry space)
    // Lattice visibility around p = 0.28 to 0.48
    if (this.lineMaterial && this.latticePointsMat) {
      const latticeVis = Math.max(0, 1.0 - Math.abs(p - 0.38) * 3.8);
      this.lineMaterial.opacity = latticeVis * 0.45;
      this.latticePointsMat.opacity = latticeVis * 0.85;
    }

    // Quantum Wave visibility around p = 0.48 to 0.70
    if (this.waveMaterial) {
      const waveVis = Math.max(0, 1.0 - Math.abs(p - 0.58) * 4.2);
      this.waveMaterial.uniforms.uOpacity.value = waveVis * 0.9;
    }

    // Perspective highway visibility around p = 0.72 to 0.92
    if (this.highwayGroup) {
      const highwayVis = Math.max(0, 1.0 - Math.abs(p - 0.82) * 4.5);
      this.highwayGroup.children.forEach(line => {
        line.material.opacity = highwayVis * 0.4;
      });
    }

    // Beam visibility at the finale
    if (this.beamMesh) {
      const beamVis = Math.max(0, 1.0 - Math.abs(p - 0.92) * 5.0);
      this.beamMesh.material.uniforms.uAlpha.value = beamVis * 0.85;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
