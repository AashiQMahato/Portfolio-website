import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gsap, EASE } from "../../motion";
import { techColor, inkColor } from "./techColor";

/**
 * The capability lab: a silicon die at the centre, the active capability's
 * technologies as extruded official marks on a tilted orbit, joined to the
 * die by PCB-style traces. One canvas, demand rendering (a frame is drawn
 * only when something moved), geometry cached per technology and disposed
 * on teardown. DOM buttons in `labelLayer` sit over each mark — they are the
 * accessible, hoverable targets; this class only positions them.
 */

const FOV = 30;
const CAM_Z = 17;
const DIE = 2.2; // die edge length
const ORBIT = { rx: 4.5, ry: 2.55, rz: 1.7, start: (155 * Math.PI) / 180 };
const PALETTE = {
  dark: { die: "#141417", dieLine: "#3a3a40", pin: "#8a8a90", trace: "#4a4a52", plate: "#16161a" },
  light: { die: "#e7e4dc", dieLine: "#b9b4a8", pin: "#8d897f", trace: "#bdb8ad", plate: "#fbfaf7" },
};

const svgLoader = new SVGLoader();
const tmp = new Vector3();

// Every motion here uses one of two durations; reduced motion zeroes both.
const D = (reduced, s) => (reduced ? 0 : s);

export default class TechScene {
  constructor(host, labelLayer, { theme = "dark", reduced = false, onRender } = {}) {
    // Own canvas per instance: a context lost on teardown (dispose) can never
    // be handed to the next instance, e.g. React StrictMode's remount in dev.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 h-full w-full";
    host.prepend(canvas);
    this.host = host;
    this.canvas = canvas;
    this.labelLayer = labelLayer;
    this.theme = theme;
    this.reduced = reduced;
    this.onRender = onRender;
    this.nodes = [];
    this.geoCache = new Map();
    this.disposables = new Set();
    this.highlighted = null;
    this.frame = 0;

    try {
      this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (err) {
      canvas.remove();
      throw err;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = SRGBColorSpace;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, CAM_Z);

    this.scene.add(new AmbientLight("#ffffff", 0.9));
    const key = new DirectionalLight("#ffffff", 2.1);
    key.position.set(3, 4, 8);
    const rim = new DirectionalLight("#ff6a33", 0.7);
    rim.position.set(-6, -2, -4);
    this.scene.add(key, rim);

    // Rig: everything that tilts with the pointer.
    this.rig = new Group();
    this.rig.rotation.set(-0.12, 0.18, 0);
    this.scene.add(this.rig);

    this.buildDie();
    this.buildOrbit();

    this.labelPlane = this.track(new PlaneGeometry(1.25, 0.82));
    this.nodeLayer = new Group();
    this.rig.add(this.nodeLayer);

    this.quickX = gsap.quickTo(this.rig.rotation, "y", { duration: 0.9, ease: EASE.soft, onUpdate: () => this.invalidate() });
    this.quickY = gsap.quickTo(this.rig.rotation, "x", { duration: 0.9, ease: EASE.soft, onUpdate: () => this.invalidate() });

    this.resize();
  }

  /* ------------------------------------------------------------ build */

  track(o) {
    this.disposables.add(o);
    return o;
  }

  buildDie() {
    const pal = PALETTE[this.theme];
    this.die = new Group();
    this.dieMat = this.track(new MeshStandardMaterial({ color: pal.die, metalness: 0.55, roughness: 0.38 }));
    const body = new Mesh(this.track(new BoxGeometry(DIE, DIE, 0.32)), this.dieMat);
    this.dieEdgeMat = this.track(new LineBasicMaterial({ color: pal.dieLine, transparent: true, opacity: 0.9 }));
    const edges = new LineSegments(this.track(new EdgesGeometry(body.geometry)), this.dieEdgeMat);

    // Face: a canvas texture with the capability index — rewritten per category.
    this.faceCanvas = document.createElement("canvas");
    this.faceCanvas.width = this.faceCanvas.height = 512;
    this.faceTex = this.track(new CanvasTexture(this.faceCanvas));
    this.faceTex.colorSpace = SRGBColorSpace;
    this.faceTex.anisotropy = 4;
    this.faceMat = this.track(new MeshBasicMaterial({ map: this.faceTex, transparent: true }));
    const face = new Mesh(this.track(new PlaneGeometry(DIE * 0.86, DIE * 0.86)), this.faceMat);
    face.position.z = 0.165;

    // Pins: 7 per side, one instanced mesh.
    const perSide = 7;
    this.pinMat = this.track(new MeshStandardMaterial({ color: pal.pin, metalness: 0.9, roughness: 0.3 }));
    const pins = new InstancedMesh(this.track(new BoxGeometry(0.1, 0.32, 0.08)), this.pinMat, perSide * 4);
    const dummy = new Object3D();
    let i = 0;
    for (let side = 0; side < 4; side++) {
      for (let k = 0; k < perSide; k++) {
        const t = (k - (perSide - 1) / 2) * 0.26;
        const out = DIE / 2 + 0.14;
        const [x, y] = [
          [t, out],
          [out, t],
          [t, -out],
          [-out, t],
        ][side];
        dummy.position.set(x, y, -0.05);
        dummy.rotation.set(0, 0, side % 2 ? Math.PI / 2 : 0);
        dummy.updateMatrix();
        pins.setMatrixAt(i++, dummy.matrix);
      }
    }
    this.die.add(body, edges, face, pins);
    this.rig.add(this.die);
  }

  buildOrbit() {
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(ORBIT.rx * Math.cos(a), ORBIT.ry * Math.sin(a), ORBIT.rz * Math.sin(a));
    }
    const geo = this.track(new BufferGeometry());
    geo.setAttribute("position", new Float32BufferAttribute(pts, 3));
    this.orbitMat = this.track(new LineBasicMaterial({ color: PALETTE[this.theme].trace, transparent: true, opacity: 0.5 }));
    this.orbit = new Line(geo, this.orbitMat);
    this.orbitCount = 161;
    this.rig.add(this.orbit);
  }

  drawFace(cap) {
    const ctx = this.faceCanvas.getContext("2d");
    const s = 512;
    const ink = inkColor(this.theme);
    ctx.clearRect(0, 0, s, s);
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 2;
    for (let g = 64; g < s; g += 64) {
      ctx.beginPath();
      ctx.moveTo(g, 0);
      ctx.lineTo(g, s);
      ctx.moveTo(0, g);
      ctx.lineTo(s, g);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ff6a33";
    ctx.beginPath();
    ctx.arc(52, 52, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = "500 200px 'Geist Mono Variable', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cap.index, s / 2, s / 2 - 10);
    ctx.globalAlpha = 0.6;
    ctx.font = "500 34px 'Geist Mono Variable', ui-monospace, monospace";
    ctx.fillText(cap.id.toUpperCase(), s / 2, s - 92);
    ctx.globalAlpha = 1;
    this.faceTex.needsUpdate = true;
  }

  /** Extruded official mark (cached), or an engraved plate for monograms. */
  geometryFor(tech) {
    if (this.geoCache.has(tech.name)) return this.geoCache.get(tech.name);
    let geo;
    if (tech.icon) {
      const data = svgLoader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${tech.icon.path}"/></svg>`);
      const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
      geo = new ExtrudeGeometry(shapes, {
        depth: 2.2,
        bevelEnabled: true,
        bevelThickness: 0.35,
        bevelSize: 0.22,
        bevelSegments: 2,
        curveSegments: 10,
      });
      geo.center();
      geo.scale(1 / 24, -1 / 24, 1 / 24); // 24-unit icon grid → 1 unit; flip SVG's y-down
      // The y flip inverts winding; flip index order back so faces point outward.
      const idx = geo.index;
      if (idx) {
        for (let i = 0; i < idx.count; i += 3) {
          const a = idx.getX(i + 1);
          idx.setX(i + 1, idx.getX(i + 2));
          idx.setX(i + 2, a);
        }
      } else {
        const pos = geo.attributes.position;
        const norm = geo.attributes.normal;
        for (let i = 0; i < pos.count; i += 3) {
          for (const attr of [pos, norm]) {
            const [x, y, z] = [attr.getX(i + 1), attr.getY(i + 1), attr.getZ(i + 1)];
            attr.setXYZ(i + 1, attr.getX(i + 2), attr.getY(i + 2), attr.getZ(i + 2));
            attr.setXYZ(i + 2, x, y, z);
          }
        }
      }
      geo.computeVertexNormals();
    } else {
      const w = 1.25;
      const h = 0.82;
      const r = 0.12;
      const shape = new Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      geo = new ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 });
      geo.center();
    }
    this.geoCache.set(tech.name, geo);
    this.track(geo);
    return geo;
  }

  monogramTexture(code) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 168;
    const ctx = c.getContext("2d");
    const ink = inkColor(this.theme);
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 228, 140);
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
    ctx.font = `600 ${code.length > 3 ? 54 : 66}px 'Geist Mono Variable', ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(code, 128, 88);
    ctx.fillStyle = "#ff6a33";
    ctx.fillRect(26, 26, 10, 10);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }

  /** Art-directed slots on the tilted orbit; the first tech is the anchor. */
  slots(n) {
    return Array.from({ length: n }, (_, i) => {
      const a = ORBIT.start + (i / n) * Math.PI * 2;
      const pos = new Vector3(ORBIT.rx * Math.cos(a), ORBIT.ry * Math.sin(a), ORBIT.rz * Math.sin(a));
      const size = i === 0 ? 1.45 : 1.05 + (pos.z > 0 ? 0.12 : 0);
      return { pos, size };
    });
  }

  /** PCB route: out of the die's nearest side, a 45° jog, then straight in. */
  tracePoints(target, size) {
    const horizontal = Math.abs(target.x) / ORBIT.rx >= Math.abs(target.y) / ORBIT.ry;
    const [u, v] = horizontal ? ["x", "y"] : ["y", "x"];
    const sign = Math.sign(target[u]) || 1;
    const p0 = new Vector3();
    p0[u] = sign * (DIE / 2 + 0.3);
    p0[v] = Math.max(-0.75, Math.min(0.75, target[v] * 0.3));
    const p1 = p0.clone();
    p1[u] += sign * 0.45;
    const end = target.clone();
    end[u] -= sign * (size * 0.62);
    const jog = Math.min(Math.abs(end[v] - p1[v]), Math.max(0, Math.abs(end[u] - p1[u]) - 0.2));
    const p2 = p1.clone();
    p2[u] += sign * jog;
    p2[v] += Math.sign(end[v] - p1[v]) * jog;
    const p3 = p2.clone();
    p3[v] = end[v];
    const route = [p0, p1, p2, p3, end];
    route.forEach((p, k) => (p.z = (end.z * k) / (route.length - 1)));
    // Resample evenly so drawRange reveals the route smoothly.
    const out = [];
    const lens = route.slice(1).map((p, k) => p.distanceTo(route[k]));
    const total = lens.reduce((a, b) => a + b, 0);
    const steps = 48;
    for (let s = 0; s <= steps; s++) {
      let d = (s / steps) * total;
      let k = 0;
      while (k < lens.length - 1 && d > lens[k]) d -= lens[k++];
      tmp.copy(route[k]).lerp(route[k + 1], lens[k] ? Math.min(1, d / lens[k]) : 0);
      out.push(tmp.x, tmp.y, tmp.z);
    }
    return out;
  }

  makeNode(tech, slot) {
    const group = new Group();
    let mesh;
    if (tech.icon) {
      const mat = new MeshStandardMaterial({
        color: techColor(tech.icon.hex, this.theme),
        metalness: 0.25,
        roughness: 0.42,
        transparent: true,
      });
      mesh = new Mesh(this.geometryFor(tech), mat);
      mesh.scale.setScalar(slot.size);
    } else {
      const plateMat = new MeshStandardMaterial({ color: PALETTE[this.theme].plate, metalness: 0.4, roughness: 0.5, transparent: true });
      mesh = new Mesh(this.geometryFor(tech), plateMat);
      const tex = this.monogramTexture(tech.code);
      const label = new Mesh(this.labelPlane, new MeshBasicMaterial({ map: tex, transparent: true }));
      label.position.z = 0.1;
      label.userData.tex = tex;
      mesh.add(label);
      mesh.scale.setScalar(slot.size * 1.05);
    }
    group.add(mesh);
    group.position.copy(slot.pos);
    group.rotation.y = -slot.pos.x * 0.06; // marks face slightly toward the die

    const traceGeo = new BufferGeometry();
    traceGeo.setAttribute("position", new Float32BufferAttribute(this.tracePoints(slot.pos, slot.size), 3));
    traceGeo.setDrawRange(0, 0);
    const traceMat = new LineBasicMaterial({ color: PALETTE[this.theme].trace, transparent: true, opacity: 0.85 });
    const trace = new Line(traceGeo, traceMat);
    this.rig.add(trace);
    this.nodeLayer.add(group);

    const node = {
      tech,
      slot,
      group,
      mesh,
      trace,
      state: { opacity: 0, dim: 1, draw: 0, lift: 0, scale: 0.55, z: -4 },
      label: null,
    };
    this.applyNode(node);
    return node;
  }

  applyNode(node) {
    const { state, group, slot, mesh, trace } = node;
    group.position.set(slot.pos.x, slot.pos.y + (node.floatY ?? 0), slot.pos.z + state.z + state.lift);
    group.scale.setScalar(state.scale * (1 + state.lift * 0.16));
    mesh.traverse((o) => {
      if (o.material) o.material.opacity = state.opacity * state.dim;
    });
    trace.geometry.setDrawRange(0, Math.round(state.draw * 49));
  }

  disposeNode(node) {
    node.mesh.traverse((o) => {
      if (o.material) {
        o.material.map?.dispose();
        o.material.dispose();
      }
      o.userData.tex?.dispose();
    });
    node.trace.geometry.dispose();
    node.trace.material.dispose();
    this.nodeLayer.remove(node.group);
    this.rig.remove(node.trace);
  }

  /* ------------------------------------------------------------ motion */

  /** First appearance: die tilts up into place, orbit draws, marks arrive. */
  intro(cap) {
    this.cap = cap;
    this.drawFace(cap);
    // The face is drawn on a canvas: redraw once the mono webfont is ready.
    document.fonts?.ready.then(() => {
      if (this.cap) this.drawFace(this.cap);
      this.invalidate();
    });
    const r = this.reduced;
    this.die.scale.setScalar(r ? 1 : 0.4);
    this.die.rotation.set(r ? 0 : -1.1, 0, r ? 0 : -0.6);
    this.orbit.geometry.setDrawRange(0, r ? this.orbitCount : 0);
    const orbitState = { n: r ? 1 : 0 };
    this.introTl?.kill();
    this.introTl = gsap
      .timeline({ onUpdate: () => this.invalidate() })
      .to(this.die.scale, { x: 1, y: 1, z: 1, duration: D(r, 1.1), ease: EASE.expo }, 0)
      .to(this.die.rotation, { x: 0, z: 0, duration: D(r, 1.3), ease: EASE.expo }, 0)
      .to(orbitState, {
        n: 1,
        duration: D(r, 1.2),
        ease: EASE.inOut,
        onUpdate: () => this.orbit.geometry.setDrawRange(0, Math.round(orbitState.n * this.orbitCount)),
      }, 0.15);
    return this.introTl;
  }

  /** Build the nodes for `cap` and animate them in (after exit()). */
  enter(cap) {
    this.cap = cap;
    this.drawFace(cap);
    this.nodes.forEach((n) => this.disposeNode(n));
    const slots = this.slots(cap.techs.length);
    this.nodes = cap.techs.map((t, i) => this.makeNode(t, slots[i]));
    this.bindLabels();
    const r = this.reduced;
    this.enterTl?.kill();
    this.enterTl = gsap.timeline({ onUpdate: () => this.invalidate() });
    if (!r) this.enterTl.fromTo(this.die.rotation, { z: -Math.PI / 2 }, { z: 0, duration: 0.9, ease: EASE.expo }, 0);
    this.nodes.forEach((n, i) => {
      this.enterTl.to(
        n.state,
        { opacity: 1, scale: 1, z: 0, duration: D(r, 0.8), ease: EASE.expo, onUpdate: () => this.applyNode(n) },
        r ? 0 : 0.08 + i * 0.06,
      );
      this.enterTl.to(n.state, { draw: 1, duration: D(r, 0.6), ease: EASE.out, onUpdate: () => this.applyNode(n) }, r ? 0 : 0.25 + i * 0.06);
    });
    this.highlight(this.highlighted);
    return this.enterTl;
  }

  /** Current marks recede into depth and their traces retract. Resolves when done. */
  exit() {
    this.enterTl?.kill();
    this.exitTl?.kill();
    if (!this.nodes.length || this.reduced) return Promise.resolve();
    this.exitTl = gsap.timeline({ onUpdate: () => this.invalidate() });
    this.nodes.forEach((n, i) => {
      this.exitTl.to(
        n.state,
        { opacity: 0, scale: 0.6, z: -3, draw: 0, lift: 0, duration: 0.34, ease: "power2.in", onUpdate: () => this.applyNode(n) },
        i * 0.025,
      );
    });
    return this.exitTl.then();
  }

  /** Bring one mark forward, light its trace in brand colour, settle the rest back. */
  highlight(name) {
    this.highlighted = name;
    const r = this.reduced;
    // Related = shares at least one real project with the focused technology; those stay lit.
    const focus = this.nodes.find((n) => n.tech.name === name);
    const shared = new Set(focus?.tech.projects.map((p) => p.href));
    this.nodes.forEach((n) => {
      const on = n.tech.name === name;
      const related = !on && n.tech.projects.some((p) => shared.has(p.href));
      const dim = name && !on && !related;
      const redraw = () => {
        this.applyNode(n);
        this.invalidate();
      };
      gsap.to(n.state, { lift: on ? 1.1 : 0, dim: dim ? 0.3 : 1, duration: D(r, 0.45), ease: EASE.out, overwrite: "auto", onUpdate: redraw });
      gsap.to(n.group.rotation, {
        x: on ? -0.12 : 0,
        y: (on ? 0.14 : 0) - n.slot.pos.x * 0.06,
        duration: D(r, 0.6),
        ease: EASE.out,
        overwrite: "auto",
        onUpdate: redraw,
      });
      const traceColor = new Color(on ? (n.tech.icon ? techColor(n.tech.icon.hex, this.theme) : "#ff6a33") : PALETTE[this.theme].trace);
      gsap.to(n.trace.material.color, { r: traceColor.r, g: traceColor.g, b: traceColor.b, duration: D(r, 0.3), onUpdate: redraw });
      if (n.label) n.label.dataset.state = on ? "on" : related ? "related" : dim ? "dim" : "";
    });
    this.invalidate();
  }

  /** A row is being considered in the list: the die answers with a small lift. */
  preview(active) {
    gsap.to(this.die.position, { z: active ? 0.45 : 0, duration: D(this.reduced, 0.5), ease: EASE.out, overwrite: "auto", onUpdate: () => this.invalidate() });
    gsap.to(this.orbitMat, { opacity: active ? 0.85 : 0.5, duration: D(this.reduced, 0.4), overwrite: "auto" });
  }

  /** Pointer in normalised [-1, 1] stage coords. */
  pointer(nx, ny) {
    if (this.reduced) return;
    this.quickX(0.18 + nx * 0.16);
    this.quickY(-0.12 + ny * 0.1);
  }

  /* ------------------------------------------------------------ frame */

  bindLabels() {
    const els = this.labelLayer.querySelectorAll("[data-tech-label]");
    const byName = new Map([...els].map((el) => [el.dataset.techLabel, el]));
    this.nodes.forEach((n) => (n.label = byName.get(n.tech.name) ?? null));
    this.invalidate();
  }

  invalidate() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    const { width, height } = this.size;
    const camZ = this.camera.position.z;
    const unitsPerPx = (z) => (2 * Math.tan((FOV * Math.PI) / 360) * (camZ - z)) / height;
    this.nodes.forEach((n) => {
      if (!n.label) return;
      n.group.getWorldPosition(tmp);
      const z = tmp.z;
      tmp.project(this.camera);
      const x = (tmp.x * 0.5 + 0.5) * width;
      const y = (-tmp.y * 0.5 + 0.5) * height;
      const px = (n.slot.size * n.group.scale.x) / unitsPerPx(z);
      n.label.style.transform = `translate3d(${x - px / 2}px, ${y - px / 2}px, 0)`;
      n.label.style.width = n.label.style.height = `${px}px`;
      n.label.style.opacity = n.state.opacity;
      n.label.style.zIndex = String(Math.round(50 + z * 10));
    });
    this.onRender?.();
  }

  resize() {
    const rect = this.host.getBoundingClientRect();
    this.size = { width: rect.width, height: rect.height };
    this.renderer.setSize(rect.width, rect.height, false);
    this.camera.aspect = rect.width / rect.height;
    // Keep the whole orbit in frame on narrower stages.
    const needW = (ORBIT.rx + 1.4) * 2;
    const visW = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z * this.camera.aspect;
    this.camera.position.z = visW < needW ? (CAM_Z * needW) / visW : CAM_Z;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }

  setTheme(theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    const pal = PALETTE[theme];
    this.dieMat.color.set(pal.die);
    this.dieEdgeMat.color.set(pal.dieLine);
    this.pinMat.color.set(pal.pin);
    this.orbitMat.color.set(pal.trace);
    if (this.cap) {
      this.drawFace(this.cap);
      const cap = this.cap;
      // Rebuild marks so brand colours and monogram ink follow the theme.
      this.enter(cap).progress(1);
    }
    this.invalidate();
  }

  /** Slow idle float while the stage is on screen (off otherwise: no frames drawn). */
  setFloating(on) {
    if (on === Boolean(this.floatTick)) return;
    if (on) {
      this.floatTick = () => {
        const t = performance.now() / 1000;
        this.nodes.forEach((n, i) => {
          n.floatY = Math.sin(t * 0.7 + i * 1.9) * 0.06;
          this.applyNode(n);
        });
        this.invalidate();
      };
      gsap.ticker.add(this.floatTick);
    } else {
      gsap.ticker.remove(this.floatTick);
      this.floatTick = null;
    }
  }

  dispose() {
    this.setFloating(false);
    cancelAnimationFrame(this.frame);
    [this.introTl, this.enterTl, this.exitTl].forEach((t) => t?.kill());
    gsap.killTweensOf(this.rig.rotation);
    this.nodes.forEach((n) => this.disposeNode(n));
    this.disposables.forEach((d) => d.dispose?.());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}
