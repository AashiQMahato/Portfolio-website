import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { gsap } from "../../motion";

/**
 * The hero's one visual idea: an oscilloscope trace running under the name —
 * a hardware signal rendered as an interface. The pointer bends the wave
 * locally (a gaussian envelope centred on the cursor), scroll velocity
 * excites it, and it relaxes back to a calm carrier.
 *
 * 2D canvas on the shared GSAP ticker (no WebGL, no extra RAF loop). It
 * pauses off-screen and in background tabs, caps DPR at 2, reads its
 * colours from the theme tokens, and under reduced motion draws one
 * static frame.
 */
const css = (name) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `rgb(${v.split(/\s+/).join(",")}` : "rgb(255,106,51";
};

const SignalField = ({ static: isStatic = false, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let dpr = 1;
    let colors = {};
    const pointer = { x: 0.62, y: 0.5, active: 0 }; // normalised, eased
    const target = { x: 0.62, y: 0.5, active: 0 };
    let excite = 0;
    let lastScroll = window.scrollY;
    let t = 0;
    let running = false;
    let visible = true;

    const readColors = () => {
      colors = {
        signal: css("--signal"),
        ink: css("--ink"),
        line: css("--line"),
      };
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const wave = (x, phase, amp, envAmp) => {
      const nx = x / w;
      const carrier =
        Math.sin(nx * 9 + phase) * 0.55 +
        Math.sin(nx * 23 - phase * 1.7) * 0.18 +
        Math.sin(nx * 3.2 + phase * 0.4) * 0.27;
      const d = nx - pointer.x;
      const envelope = Math.exp(-(d * d) / 0.012) * envAmp;
      const burst = Math.sin(nx * 70 - phase * 6) * envelope;
      return carrier * amp + burst;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const base = h * 0.62;
      const amp = Math.max(10, h * 0.035) * (1 + excite * 2.2);
      const envAmp = h * 0.11 * pointer.active;

      // Graticule: baseline + ticks, like a scope screen.
      ctx.strokeStyle = `${colors.line},1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, base + 0.5);
      ctx.lineTo(w, base + 0.5);
      for (let x = 0; x <= w; x += 64) {
        const major = (x / 64) % 4 === 0;
        ctx.moveTo(x + 0.5, base - (major ? 10 : 4));
        ctx.lineTo(x + 0.5, base + (major ? 10 : 4));
      }
      ctx.stroke();

      // Ghost trace — the previous sweep, faint.
      ctx.strokeStyle = `${colors.ink},0.1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = base + wave(x, t - 0.9, amp * 0.8, envAmp * 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Live trace.
      ctx.strokeStyle = `${colors.signal},0.95)`;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = base + wave(x, t, amp, envAmp);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Probe: a marker riding the trace at the pointer.
      if (pointer.active > 0.02) {
        const px = pointer.x * w;
        const py = base + wave(px, t, amp, envAmp);
        ctx.fillStyle = `${colors.signal},${pointer.active})`;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `${colors.ink},${0.25 * pointer.active})`;
        ctx.beginPath();
        ctx.moveTo(px + 0.5, 0);
        ctx.lineTo(px + 0.5, h);
        ctx.stroke();
      }
    };

    const tick = (_, dt) => {
      const k = Math.min(dt / 16.7, 3);
      pointer.x += (target.x - pointer.x) * 0.08 * k;
      pointer.active += (target.active - pointer.active) * 0.06 * k;
      const sy = window.scrollY;
      excite = Math.min(1, excite * 0.92 + Math.abs(sy - lastScroll) * 0.004);
      lastScroll = sy;
      t += 0.012 * k * (1 + excite * 1.5);
      draw();
    };

    const start = () => {
      if (running || isStatic || !visible || document.hidden) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      target.active = target.y > -0.1 && target.y < 1.1 ? 1 : 0;
    };
    const onLeave = () => {
      target.active = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    readColors();
    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isStatic]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
};

SignalField.propTypes = {
  static: PropTypes.bool,
  className: PropTypes.string,
};

export default SignalField;
