/*
 * IMI Service – scena 3D
 * - Tergivetro che pulisce lo schermo durante l'intro (pilotato da main.js tramite window.IMI3D)
 * - Spruzzino che accompagna lo scroll agganciandosi agli elementi [data-anchor]
 * I modelli sono generati via codice; se in config.js è indicato un .glb, viene usato quello.
 */
import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/three/jsm/environments/RoomEnvironment.js';

const C = Object.assign({ models: {} }, window.IMI_CONFIG || {});
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('scene3d');

const fail = (why) => {
  if (canvas) canvas.classList.add('is-off');
  if (why) console.warn('[IMI 3D]', why);
  window.dispatchEvent(new Event('imi3d:failed'));
};

if (!canvas) {
  fail();
} else if (reduced) {
  fail();
} else {
  init().catch((e) => fail(e));
}

async function init() {
  /* ---------------- Renderer ---------------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    fail('WebGL non disponibile');
    return;
  }
  const isSmall = () => window.innerWidth < 760;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(3, 5, 6);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9cfbd, 0.7));
  const rim = new THREE.DirectionalLight(0xffe7a3, 0.8);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  let W = 1, H = 1, unit = 0.01;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    unit = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / H;
  }
  resize();
  window.addEventListener('resize', resize);
  // Converte px dello schermo in coordinate 3D sul piano z (compensando la prospettiva)
  const toWorld = (x, y, out = new THREE.Vector3(), z = 0) => {
    const f = (camera.position.z - z) / camera.position.z;
    return out.set((x - W / 2) * unit * f, -(y - H / 2) * unit * f, z);
  };
  const pxAt = (z) => unit * ((camera.position.z - z) / camera.position.z);

  /* ---------------- Materiali ---------------- */
  const M = {
    yellow: new THREE.MeshPhysicalMaterial({ color: 0xffd23c, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
    navy: new THREE.MeshPhysicalMaterial({ color: 0x0e1a2b, roughness: 0.38, clearcoat: 0.6 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xe6eaef, metalness: 1, roughness: 0.16 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x15181d, roughness: 0.75 }),
    bottle: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
      transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide
    }),
    liquid: new THREE.MeshPhysicalMaterial({ color: 0xffcc1f, roughness: 0.15, transparent: true, opacity: 0.88, clearcoat: 0.5 }),
    tube: new THREE.MeshStandardMaterial({ color: 0xdfe3e8, roughness: 0.4, transparent: true, opacity: 0.7 })
  };
  const mesh = (geo, mat) => { const m = new THREE.Mesh(geo, mat); return m; };

  /* ---------------- Tergivetro (procedurale) ----------------
     Lama lungo Y (lunghezza 1), gomma verso il "vetro" (-Z), manico verso la camera. */
  function makeSqueegee() {
    const root = new THREE.Group();
    const rubber = mesh(new THREE.BoxGeometry(0.028, 1.0, 0.07), M.rubber);
    rubber.position.z = -0.065;
    const channel = mesh(new THREE.BoxGeometry(0.08, 1.02, 0.075), M.chrome);
    const shine = mesh(new THREE.BoxGeometry(0.02, 1.0, 0.078), M.chrome);
    shine.position.x = -0.03;
    root.add(rubber, channel, shine);
    for (const s of [-1, 1]) {
      const cap = mesh(new THREE.BoxGeometry(0.1, 0.035, 0.1), M.navy);
      cap.position.y = s * 0.515;
      root.add(cap);
    }
    const handle = new THREE.Group();
    const clip = mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.14, 28), M.navy);
    clip.rotation.x = Math.PI / 2;
    clip.position.z = 0.09;
    const shaft = mesh(new THREE.CylinderGeometry(0.045, 0.052, 0.62, 32), M.yellow);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.46;
    handle.add(clip, shaft);
    for (const z of [0.56, 0.61, 0.66]) {
      const ring = mesh(new THREE.TorusGeometry(0.05, 0.008, 8, 28), M.navy);
      ring.position.z = z;
      handle.add(ring);
    }
    const end = mesh(new THREE.SphereGeometry(0.052, 24, 16), M.navy);
    end.position.z = 0.77;
    handle.add(end);
    root.add(handle);
    root.userData.handle = handle;
    return root;
  }

  /* ---------------- Spruzzino (procedurale) ----------------
     Ugello rivolto verso -X, etichetta verso la camera. */
  function labelTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const g = c.getContext('2d');
    const t = new THREE.CanvasTexture(c);
    const draw = () => {
    g.fillStyle = '#0e1a2b';
    g.fillRect(0, 0, 1024, 512);
    g.fillStyle = '#ffd23c';
    g.fillRect(0, 430, 1024, 22);
    g.textAlign = 'center';
    g.fillStyle = '#ffffff';
    g.font = '800 210px Manrope, system-ui, sans-serif';
    g.fillText('IMI', 512, 250);
    g.fillStyle = '#ffd23c';
    g.font = '800 74px Manrope, system-ui, sans-serif';
    g.fillText('S E R V I C E', 512, 345);
    g.fillStyle = 'rgba(255,255,255,.7)';
    g.font = '600 34px Manrope, system-ui, sans-serif';
    g.fillText('pulizie · sanificazioni', 512, 405);
    t.needsUpdate = true;
    };
    draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function makeBottle() {
    const root = new THREE.Group();
    const prof = [
      [0.001, 0], [0.34, 0], [0.4, 0.025], [0.42, 0.08], [0.42, 0.95], [0.405, 1.04],
      [0.35, 1.15], [0.25, 1.26], [0.18, 1.33], [0.17, 1.46], [0.001, 1.46]
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const body = mesh(new THREE.LatheGeometry(prof, 56), M.bottle);
    body.renderOrder = 3;

    const lprof = [[0.001, 0.03], [0.385, 0.03], [0.398, 0.07], [0.398, 0.82], [0.001, 0.82]].map(([x, y]) => new THREE.Vector2(x, y));
    const liquid = mesh(new THREE.LatheGeometry(lprof, 48), M.liquid);
    liquid.renderOrder = 1;

    const tube = mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.42, 8), M.tube);
    tube.position.set(0.06, 0.77, -0.05);

    const span = Math.PI * 0.95;
    const label = mesh(
      new THREE.CylinderGeometry(0.426, 0.426, 0.52, 64, 1, true, -span / 2, span),
      new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.45 })
    );
    label.position.y = 0.5;
    label.renderOrder = 2;

    const collar = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 36), M.navy);
    collar.position.y = 1.53;
    for (const y of [1.48, 1.53, 1.58]) {
      const rib = mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 36), M.navy);
      rib.rotation.x = Math.PI / 2;
      rib.position.y = y;
      root.add(rib);
    }

    // Testina a grilletto (profilo laterale estruso)
    const head = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0.24, 0);
    s.lineTo(-0.16, 0);
    s.quadraticCurveTo(-0.22, 0.02, -0.26, 0.07);
    s.lineTo(-0.54, 0.11);
    s.quadraticCurveTo(-0.58, 0.13, -0.58, 0.17);
    s.lineTo(-0.58, 0.25);
    s.quadraticCurveTo(-0.57, 0.29, -0.52, 0.3);
    s.lineTo(-0.04, 0.36);
    s.quadraticCurveTo(0.2, 0.36, 0.27, 0.26);
    s.quadraticCurveTo(0.3, 0.15, 0.24, 0);
    const headGeo = new THREE.ExtrudeGeometry(s, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4, curveSegments: 16 });
    headGeo.translate(0, 0, -0.12);
    head.add(mesh(headGeo, M.navy));

    const nozzle = mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.1, 24), M.yellow);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(-0.64, 0.2, 0);
    head.add(nozzle);

    const t = new THREE.Shape();
    t.moveTo(-0.2, 0.02);
    t.lineTo(-0.34, 0.02);
    t.quadraticCurveTo(-0.38, -0.12, -0.35, -0.3);
    t.quadraticCurveTo(-0.32, -0.36, -0.27, -0.33);
    t.quadraticCurveTo(-0.27, -0.16, -0.22, -0.04);
    const trigGeo = new THREE.ExtrudeGeometry(t, { depth: 0.11, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
    trigGeo.translate(0, 0, -0.055);
    const trigger = mesh(trigGeo, M.yellow);
    const trigPivot = new THREE.Group();
    trigPivot.position.set(-0.27, 0.02, 0);
    trigger.position.set(0.27, -0.02, 0);
    trigPivot.add(trigger);
    head.add(trigPivot);

    const tip = new THREE.Object3D();
    tip.position.set(-0.7, 0.2, 0);
    head.add(tip);
    head.position.y = 1.61;

    root.add(liquid, tube, body, label, collar, head);
    root.userData = { head, trigger: trigPivot, tip, local: true };
    return root;
  }

  /* ---------------- Modelli .glb opzionali ---------------- */
  async function loadModel(cfg) {
    if (!cfg || !cfg.url) return null;
    try {
      const { GLTFLoader } = await import('../vendor/three/jsm/loaders/GLTFLoader.js');
      const gltf = await new GLTFLoader().loadAsync(cfg.url);
      const obj = gltf.scene;
      if (Array.isArray(cfg.rotation)) obj.rotation.set(...cfg.rotation.map((d) => THREE.MathUtils.degToRad(d)));
      return obj;
    } catch (e) {
      console.warn('[IMI 3D] modello non caricato, uso quello generato:', cfg.url, e);
      return null;
    }
  }

  // Centra il modello e lo porta ad altezza 1
  function normalize(obj) {
    const wrap = new THREE.Group();
    wrap.add(obj);
    wrap.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrap);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = 1 / (size.y || 1);
    obj.position.sub(center);
    const outer = new THREE.Group();
    wrap.scale.setScalar(k);
    outer.add(wrap);
    outer.userData = obj.userData && obj.userData.local ? obj.userData : {};
    return outer;
  }

  const [sqGlb, btGlb] = await Promise.all([loadModel(C.models.squeegee), loadModel(C.models.bottle)]);
  const squeegee = sqGlb ? normalize(sqGlb) : makeSqueegee();
  const bottleInner = btGlb || makeBottle();
  const bottle = normalize(bottleInner);
  if (!btGlb) bottle.userData = bottleInner.userData;

  squeegee.visible = false;
  bottle.visible = false;
  scene.add(squeegee, bottle);

  /* ---------------- Particelle "spruzzo" ---------------- */
  const MAX = 260;
  const pPos = new Float32Array(MAX * 3);
  const pLife = new Float32Array(MAX).fill(1);
  const pVel = new Float32Array(MAX * 3);
  const pSize = new Float32Array(MAX);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('aLife', new THREE.BufferAttribute(pLife, 1));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uScale: { value: 1 }, uColor: { value: new THREE.Color(0x9fd8ff) } },
    vertexShader: `
      attribute float aLife; attribute float aSize; varying float vLife; uniform float uScale;
      void main() {
        vLife = aLife;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale * (0.6 + aLife * 1.4);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vLife; uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * (1.0 - vLife) * 0.75;
        if (a < 0.01) discard;
        gl_FragColor = vec4(mix(uColor, vec3(1.0), 0.35), a);
      }`
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  scene.add(points);
  let pCursor = 0;
  let aliveParticles = 0;

  const tmpV = new THREE.Vector3();
  const tmpDir = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  function emit(count, speedWorld) {
    const tip = bottle.userData.tip;
    if (!tip) return;
    tip.getWorldPosition(tmpV);
    bottle.getWorldQuaternion(tmpQ);
    tmpDir.set(-1, 0, 0).applyQuaternion(tmpQ).normalize();
    for (let i = 0; i < count; i++) {
      const k = pCursor;
      pCursor = (pCursor + 1) % MAX;
      pPos[k * 3] = tmpV.x; pPos[k * 3 + 1] = tmpV.y; pPos[k * 3 + 2] = tmpV.z;
      const sp = speedWorld * (0.6 + Math.random() * 0.8);
      const spread = 0.35;
      pVel[k * 3] = (tmpDir.x + (Math.random() - 0.5) * spread) * sp;
      pVel[k * 3 + 1] = (tmpDir.y + (Math.random() - 0.5) * spread) * sp;
      pVel[k * 3 + 2] = (tmpDir.z + (Math.random() - 0.5) * spread) * sp;
      pLife[k] = 0;
      pSize[k] = 5 + Math.random() * 11;
    }
    aliveParticles = MAX;
  }

  let sprayUntil = 0;
  let pump = 0;
  const sprayNow = () => {
    if (!bottle.visible || bottleState.scale < 0.5) return;
    sprayUntil = performance.now() + 260;
    pump = 1;
  };
  window.addEventListener('imi:spray', sprayNow);

  /* ---------------- API per l'intro ---------------- */
  const sq = { x: 0, y: 0, angle: 0, len: 100, dir: 1, swing: 0 };
  window.IMI3D = {
    squeegee: {
      show() { squeegee.visible = true; },
      hide() { squeegee.visible = false; },
      set(x, y, angle, len, dir) { Object.assign(sq, { x, y, angle, len, dir }); squeegee.visible = true; }
    }
  };
  // Pre-compilazione shader e texture fuori schermo, per evitare scatti all'avvio
  squeegee.visible = bottle.visible = true;
  squeegee.position.set(1000, 0, 0);
  bottle.position.set(1000, 0, 0);
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  squeegee.visible = bottle.visible = false;
  renderer.render(scene, camera);

  window.dispatchEvent(new Event('imi3d:ready'));

  /* ---------------- Spruzzino che segue lo scroll ---------------- */
  const anchors = Array.from(document.querySelectorAll('[data-anchor]'));
  const bottleState = {
    active: false, x: W * 0.8, y: H * 0.4, tx: W * 0.8, ty: H * 0.4,
    scale: 0, tscale: 0, appear: 0, current: null, arrived: false, nextIdle: 0
  };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / W) * 2 - 1;
    pointer.y = (e.clientY / H) * 2 - 1;
  }, { passive: true });

  let lastScroll = window.scrollY;
  let scrollVel = 0;

  const startBottle = () => {
    bottleState.active = true;
    const a = pickAnchor();
    if (a) { bottleState.x = a.x; bottleState.y = a.y - 120; }
    bottleState.nextIdle = performance.now() + 6000;
  };
  if (document.body.classList.contains('intro-done')) startBottle();
  else window.addEventListener('imi:intro-done', startBottle, { once: true });

  function bottleSizePx() {
    if (W >= 1100) return 230;
    if (W >= 760) return 180;
    return 112;
  }

  function pickAnchor() {
    const small = isSmall();
    let best = null;
    let bestD = Infinity;
    for (const a of anchors) {
      if (small && !a.dataset.mobile) continue;
      const r = a.getBoundingClientRect();
      if (r.width === 0 && r.height === 0 && r.top === 0 && r.left === 0) continue;
      if (r.top < -H * 0.15 || r.top > H * 1.05) continue;
      const d = Math.abs(r.top - H * 0.42);
      if (d < bestD) { bestD = d; best = { el: a, x: r.left, y: r.top, scale: Number(a.dataset.scale) || 1 }; }
    }
    return best;
  }

  /* ---------------- Loop ---------------- */
  const clock = new THREE.Clock();
  const ease = (k, dt) => 1 - Math.exp(-k * dt);
  let idleFrames = 0;

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    let busy = false;

    // Tergivetro
    if (squeegee.visible) {
      busy = true;
      toWorld(sq.x, sq.y, squeegee.position, 0.6);
      const s = sq.len * pxAt(0.6);
      squeegee.scale.setScalar(s);
      squeegee.rotation.set(0, sq.dir * 0.28, -sq.angle);
      const h = squeegee.userData.handle;
      if (h) {
        sq.swing += ((-sq.dir * 0.95) - sq.swing) * ease(10, dt);
        h.rotation.set(0.32, sq.swing, 0);
      }
    }

    // Spruzzino
    if (bottleState.active) {
      const sy = window.scrollY;
      scrollVel += ((sy - lastScroll) / Math.max(dt, 0.001) - scrollVel) * ease(8, dt);
      lastScroll = sy;

      const a = pickAnchor();
      if (a) {
        bottleState.tx = a.x;
        bottleState.ty = a.y;
        bottleState.tscale = a.scale;
        if (bottleState.current !== a.el) { bottleState.current = a.el; bottleState.arrived = false; }
      } else {
        bottleState.tscale = 0;
        bottleState.current = null;
      }

      const k = ease(5.5, dt);
      bottleState.x += (bottleState.tx - bottleState.x) * k;
      bottleState.y += (bottleState.ty - bottleState.y) * k;
      bottleState.scale += (bottleState.tscale - bottleState.scale) * ease(7, dt);
      bottleState.appear = Math.min(1, bottleState.appear + dt * 1.4);
      const pop = 1 + 2.2 * Math.pow(bottleState.appear - 1, 3) + 1.2 * Math.pow(bottleState.appear - 1, 2); // easeOutBack
      const dist = Math.hypot(bottleState.tx - bottleState.x, bottleState.ty - bottleState.y);

      if (bottleState.current && !bottleState.arrived && dist < 24 && bottleState.appear >= 1) {
        bottleState.arrived = true;
        sprayNow();
      }
      const now = performance.now();
      if (now > bottleState.nextIdle) {
        bottleState.nextIdle = now + 7000 + Math.random() * 4000;
        sprayNow();
      }

      const visibleScale = bottleState.scale * pop;
      bottle.visible = visibleScale > 0.02;
      if (bottle.visible) {
        busy = true;
        pointer.sx += (pointer.x - pointer.sx) * ease(3, dt);
        pointer.sy += (pointer.y - pointer.sy) * ease(3, dt);
        const bob = Math.sin(t * 1.6) * 7;
        toWorld(bottleState.x, bottleState.y + bob, bottle.position, 0.8);
        bottle.scale.setScalar(bottleSizePx() * pxAt(0.8) * visibleScale);
        const vx = (bottleState.tx - bottleState.x) * 0.002;
        const spin = THREE.MathUtils.clamp(scrollVel * 0.0004, -0.6, 0.6);
        bottle.rotation.set(
          0.08 + pointer.sy * 0.12 + spin * 0.3,
          -0.55 + Math.sin(t * 0.7) * 0.28 + pointer.sx * 0.35 + spin,
          THREE.MathUtils.clamp(-vx, -0.35, 0.35) + Math.sin(t * 1.1) * 0.04
        );
      }

      // pompa + spruzzo
      if (now < sprayUntil) emit(6, bottleSizePx() * unit * 3);
      pump = Math.max(0, pump - dt * 3.5);
      const ud = bottle.userData;
      if (ud.trigger) ud.trigger.rotation.z = -Math.sin(pump * Math.PI) * 0.35;
      if (ud.head) ud.head.position.x = Math.sin(pump * Math.PI) * 0.015;
    }

    // Particelle
    if (aliveParticles > 0) {
      busy = true;
      let alive = 0;
      const drag = Math.exp(-2.6 * dt);
      for (let i = 0; i < MAX; i++) {
        if (pLife[i] >= 1) continue;
        pLife[i] = Math.min(1, pLife[i] + dt * 1.25);
        pVel[i * 3] *= drag; pVel[i * 3 + 1] = pVel[i * 3 + 1] * drag - dt * 0.15; pVel[i * 3 + 2] *= drag;
        pPos[i * 3] += pVel[i * 3] * dt;
        pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt;
        pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
        if (pLife[i] < 1) alive++;
      }
      aliveParticles = alive;
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.aLife.needsUpdate = true;
      pGeo.attributes.aSize.needsUpdate = true;
      pMat.uniforms.uScale.value = renderer.getPixelRatio() * (bottleSizePx() / 230);
    }

    if (busy) {
      idleFrames = 0;
      renderer.render(scene, camera);
    } else if (idleFrames < 2) {
      idleFrames++;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
