"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
// #region agent log
import { debugLog } from "@/lib/debugLog";
// #endregion

/**
 * Bioluminescent data orb — a hollow shell of ~26k optotype glyphs that flies in
 * from beyond the frame and consolidates into a planet over the first couple of
 * seconds, then keeps rotating. Density peaks along the limb (you look through
 * more of the shell at grazing angles), which is what gives it a solid planetary
 * edge instead of a fuzzy cloud.
 *
 * Glyphs come from a pre-rendered atlas (one tile per glyph × brightness step)
 * drawn as GL point sprites. The whole animation lives in the vertex shader, so
 * a frame costs one draw call and a handful of uniforms; the canvas-2d path
 * below it is a fallback that thins the shell, since ~26k drawImage calls run
 * at roughly 20fps on a fast laptop.
 */

const GLYPHS = "0123456789ШБМНКЫИАЕВОСХ".split("");

// brightness ramp: deep teal shell → soft aqua highlights
// keep the top of the ramp off pure white so overlapping glyphs stay readable
const RAMP: Array<[number, number, number]> = [
  [10, 78, 74],
  [18, 104, 98],
  [30, 132, 124],
  [48, 158, 148],
  [72, 182, 170],
  [104, 204, 192],
  [138, 220, 208],
  [172, 236, 224],
];

// columns are padded past the glyph count so the atlas stays a power of two and
// can carry mipmaps — point sprites minify hard and alias badly without them
const ATLAS_COLS = 32;
const ATLAS_ROWS = RAMP.length;
const GL_CELL = 16;
const CELL_2D = 22;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function buildAtlas(cell: number) {
  const atlas = document.createElement("canvas");
  atlas.width = cell * ATLAS_COLS;
  atlas.height = cell * ATLAS_ROWS;
  const actx = atlas.getContext("2d");
  if (!actx) return atlas;

  actx.textAlign = "center";
  actx.textBaseline = "middle";
  actx.font = `500 ${Math.round(cell * 0.82)}px Inter, system-ui, sans-serif`;

  for (let row = 0; row < ATLAS_ROWS; row++) {
    const [r, g, b] = RAMP[row];
    actx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    for (let col = 0; col < GLYPHS.length; col++) {
      actx.fillText(GLYPHS[col], col * cell + cell / 2, row * cell + cell / 2);
    }
  }

  return atlas;
}

type Particles = {
  n: number;
  /** resting position on the unit shell, xyz */
  target: Float32Array;
  /** where the glyph flies in from, xyz */
  scatter: Float32Array;
  /** delay, shade, scale */
  meta: Float32Array;
  /** atlas column */
  glyph: Float32Array;
};

function buildParticles(n: number, full: boolean): Particles {
  const rand = mulberry32(20260731);
  const target = new Float32Array(n * 3);
  const scatter = new Float32Array(n * 3);
  const meta = new Float32Array(n * 3);
  const glyph = new Float32Array(n);

  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i + (rand() - 0.5) * 0.5;
    // slight radial jitter keeps the shell from looking machined
    const r = 1 + (rand() - 0.5) * 0.045;
    const x = Math.cos(theta) * ring * r;
    const z = Math.sin(theta) * ring * r;

    const o = i * 3;
    target[o] = x;
    target[o + 1] = y * r;
    target[o + 2] = z;

    if (full) {
      // a full planet has the frame edge just past its limb, so its cloud has
      // to stay tight or the first second reads as static instead of a swarm
      const out = 1.08 + rand() * 0.4;
      scatter[o] = x * out + (rand() - 0.5) * 0.16;
      scatter[o + 1] = y * r * out + (rand() - 0.5) * 0.16;
      scatter[o + 2] = z * out + (rand() - 0.5) * 0.16;
    } else {
      // the dome layer covers the viewport, so glyphs start past the screen
      // edges — mostly above it — and stream inward. Depth stays shallow on
      // purpose: scattering along z would swing particles past the camera.
      const out = 1.35 + rand() * 1.35;
      scatter[o] = x * out + (rand() - 0.5) * 1.1;
      scatter[o + 1] = y * r * out - (0.5 + rand() * 1.1);
      scatter[o + 2] = z * (0.9 + rand() * 0.5);
    }

    meta[o] = rand() * 0.55;
    meta[o + 1] = rand();
    meta[o + 2] = 0.82 + rand() * 0.5;
    glyph[i] = Math.floor(rand() * GLYPHS.length);
  }

  return { n, target, scatter, meta, glyph };
}

type Frame = {
  width: number;
  height: number;
  dpr: number;
  gather: number;
  intro: number;
  spin: number;
  tilt: number;
  radius: number;
  cx: number;
  cy: number;
  fov: number;
  glyphSize: number;
};

type Renderer = {
  resize: () => void;
  refreshAtlas: () => void;
  draw: (frame: Frame) => void;
  dispose: () => void;
};

const VERT = `
attribute vec3 aTarget;
attribute vec3 aScatter;
attribute vec3 aMeta;
attribute float aGlyph;

uniform float uGather;
uniform float uIntro;
uniform float uSpin;
uniform float uTilt;
uniform float uRadius;
uniform float uFov;
uniform float uGlyphSize;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uViewport;
// precision is spelled out because a uniform shared with the fragment shader
// has to match on both sides or the program refuses to link
uniform mediump vec2 uCellSize;

varying float vAlpha;
varying mediump vec2 vCell;

void main() {
  float delay = aMeta.x;
  float t = 1.0;
  if (uGather < 1.0) {
    float raw = clamp((uGather - delay) / (1.0 - delay), 0.0, 1.0);
    float u = 1.0 - raw;
    t = 1.0 - u * u * u;
  }
  vec3 p = mix(aScatter, aTarget, t);

  float sinY = sin(uSpin);
  float cosY = cos(uSpin);
  float sinX = sin(uTilt);
  float cosX = cos(uTilt);
  float rx = p.x * cosY - p.z * sinY;
  float rzs = p.x * sinY + p.z * cosY;
  float ry = p.y * cosX - rzs * sinX;
  float rz = p.y * sinX + rzs * cosX;

  // a scattered glyph can sit closer than the focal length, which would blow
  // the divisor up (or flip its sign), so the term is clamped
  float persp = clamp(uFov / (uFov + rz), 0.25, 2.0);
  vec2 pos = uCenter + vec2(rx, ry) * uRadius * persp;

  // negative rz is nearest the camera, so invert into 0 = far, 1 = near
  float depth = (1.0 - rz) * 0.5;
  float arrive = t * t;
  // the shell reads as translucent: far side dim, near side luminous. Its
  // deepest slice hides behind the near face, so it is dropped outright.
  // In flight that model doesn't apply — a glyph swinging behind the shell's
  // plane would blink out mid-air and pop back on arrival.
  float shell = depth < 0.2 ? 0.0 : 0.18 + 0.7 * pow(depth, 1.25);
  vAlpha = (shell * arrive + 0.26 * (1.0 - arrive)) * uIntro;

  // brightness: depth + a touch of key light + per-particle variance —
  // stay in the teal midtones so glyph shapes remain distinct
  float key = 0.5 + rx * 0.14 - ry * 0.18;
  float lum = 0.06 + depth * 0.4 + key * 0.12 + aMeta.y * 0.18;
  float row = clamp(floor(lum * float(${ATLAS_ROWS})), 0.0, float(${ATLAS_ROWS - 1}));
  vCell = vec2(aGlyph, row) * uCellSize;

  gl_PointSize = uGlyphSize * persp * aMeta.z * uDpr;
  gl_Position = vec4(
    pos.x / uViewport.x * 2.0 - 1.0,
    1.0 - pos.y / uViewport.y * 2.0,
    0.0,
    1.0
  );
}
`;

const FRAG = `
precision mediump float;

uniform sampler2D uAtlas;
uniform mediump vec2 uCellSize;

varying float vAlpha;
varying mediump vec2 vCell;

void main() {
  if (vAlpha <= 0.02) discard;
  vec4 tex = texture2D(uAtlas, vCell + gl_PointCoord * uCellSize);
  float a = tex.a * vAlpha;
  gl_FragColor = vec4(tex.rgb * a, a);
}
`;

/**
 * Asking a canvas for a webgl context is irreversible — if the program then
 * fails to build, that canvas can never hand out a 2d context for the fallback.
 * So the pipeline is rehearsed on a throwaway canvas first.
 */
function glPipelineWorks() {
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl");
  if (!gl) return false;

  const build = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vert = build(gl.VERTEX_SHADER, VERT);
  const frag = build(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag || !program) return false;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked && process.env.NODE_ENV !== "production") {
    console.warn("ParticleSphere: WebGL unavailable —", gl.getProgramInfoLog(program));
  }
  return Boolean(linked);
}

function createGLRenderer(canvas: HTMLCanvasElement, p: Particles): Renderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
  });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vert = compile(gl.VERTEX_SHADER, VERT);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag || !program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);

  const buffers: WebGLBuffer[] = [];
  const attribute = (name: string, data: Float32Array, size: number) => {
    const buffer = gl.createBuffer();
    if (!buffer) return;
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  attribute("aTarget", p.target, 3);
  attribute("aScatter", p.scatter, 3);
  attribute("aMeta", p.meta, 3);
  attribute("aGlyph", p.glyph, 1);

  const texture = gl.createTexture();
  const refreshAtlas = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      buildAtlas(GL_CELL)
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  refreshAtlas();

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uGather = u("uGather");
  const uIntro = u("uIntro");
  const uSpin = u("uSpin");
  const uTilt = u("uTilt");
  const uRadius = u("uRadius");
  const uFov = u("uFov");
  const uGlyphSize = u("uGlyphSize");
  const uDpr = u("uDpr");
  const uCenter = u("uCenter");
  const uViewport = u("uViewport");

  gl.uniform2f(u("uCellSize"), 1 / ATLAS_COLS, 1 / ATLAS_ROWS);
  gl.uniform1i(u("uAtlas"), 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // premultiplied alpha (not additive) — additive stacking blew the limb into
  // a solid white disc and erased the glyph silhouettes
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  return {
    resize: () => gl.viewport(0, 0, canvas.width, canvas.height),
    refreshAtlas,
    draw: (f) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uGather, f.gather);
      gl.uniform1f(uIntro, f.intro);
      gl.uniform1f(uSpin, f.spin);
      gl.uniform1f(uTilt, f.tilt);
      gl.uniform1f(uRadius, f.radius);
      gl.uniform1f(uFov, f.fov);
      gl.uniform1f(uGlyphSize, f.glyphSize);
      gl.uniform1f(uDpr, f.dpr);
      gl.uniform2f(uCenter, f.cx, f.cy);
      gl.uniform2f(uViewport, f.width, f.height);
      gl.drawArrays(gl.POINTS, 0, p.n);
    },
    // the context itself is left alive on purpose: getContext hands the same
    // one back on remount, and a deliberately lost context would stay dead
    dispose: () => {
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    },
  };
}

function create2DRenderer(canvas: HTMLCanvasElement, p: Particles): Renderer | null {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  // canvas 2d spends ~2µs per sprite, so the shell is thinned to something that
  // still holds a frame budget rather than dropped to a slideshow
  const stride = Math.max(1, Math.ceil(p.n / 9000));
  const picks = new Int32Array(Math.ceil(p.n / stride));
  for (let k = 0; k < picks.length; k++) picks[k] = k * stride;
  const m = picks.length;

  let atlas = buildAtlas(CELL_2D);
  let cell = CELL_2D;

  // draw order: coarse depth slabs (back to front) via counting sort — a full
  // comparison sort every frame would be pure overhead
  const SLABS = 12;
  const slabCount = new Int32Array(SLABS);
  const slabOf = new Uint8Array(m);
  const ordered = new Int32Array(m);
  const cursor = new Int32Array(SLABS);

  const projX = new Float32Array(m);
  const projY = new Float32Array(m);
  const projSize = new Float32Array(m);
  const projAlpha = new Float32Array(m);
  const projRow = new Uint8Array(m);

  return {
    resize: () => {},
    refreshAtlas: () => {
      atlas = buildAtlas(CELL_2D);
      cell = CELL_2D;
    },
    draw: (f) => {
      ctx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
      ctx.clearRect(0, 0, f.width, f.height);
      slabCount.fill(0);

      const sinY = Math.sin(f.spin);
      const cosY = Math.cos(f.spin);
      const sinX = Math.sin(f.tilt);
      const cosX = Math.cos(f.tilt);

      for (let k = 0; k < m; k++) {
        const i = picks[k];
        const o = i * 3;

        let t = 1;
        if (f.gather < 1) {
          const delay = p.meta[o];
          t = (f.gather - delay) / (1 - delay);
          t = t <= 0 ? 0 : t >= 1 ? 1 : easeOutCubic(t);
        }
        const inv = 1 - t;
        const ax = p.target[o] * t + p.scatter[o] * inv;
        const ay = p.target[o + 1] * t + p.scatter[o + 1] * inv;
        const az = p.target[o + 2] * t + p.scatter[o + 2] * inv;

        const rx = ax * cosY - az * sinY;
        const rzs = ax * sinY + az * cosY;
        const ry = ay * cosX - rzs * sinX;
        const rz = ay * sinX + rzs * cosX;

        let persp = f.fov / (f.fov + rz);
        if (persp > 2) persp = 2;
        else if (persp < 0.25) persp = 0.25;
        projX[k] = f.cx + rx * f.radius * persp;
        projY[k] = f.cy + ry * f.radius * persp;

        const depth = (1 - rz) * 0.5;
        projSize[k] = f.glyphSize * persp * p.meta[o + 2];

        const arrive = t * t;
        const shell = depth < 0.2 ? 0 : 0.18 + 0.7 * Math.pow(depth, 1.25);
        projAlpha[k] = (shell * arrive + 0.26 * (1 - arrive)) * f.intro;

        const key = 0.5 + rx * 0.14 - ry * 0.18;
        const lum = 0.06 + depth * 0.4 + key * 0.12 + p.meta[o + 1] * 0.18;
        let row = (lum * ATLAS_ROWS) | 0;
        if (row < 0) row = 0;
        else if (row >= ATLAS_ROWS) row = ATLAS_ROWS - 1;
        projRow[k] = row;

        let slab = (depth * SLABS) | 0;
        if (slab < 0) slab = 0;
        else if (slab >= SLABS) slab = SLABS - 1;
        slabOf[k] = slab;
        slabCount[slab]++;
      }

      let acc = 0;
      for (let s = 0; s < SLABS; s++) {
        cursor[s] = acc;
        acc += slabCount[s];
      }
      for (let k = 0; k < m; k++) ordered[cursor[slabOf[k]]++] = k;

      for (let j = 0; j < m; j++) {
        const k = ordered[j];
        const a = projAlpha[k];
        if (a <= 0.02) continue;
        const s = projSize[k];
        ctx.globalAlpha = a > 1 ? 1 : a;
        ctx.drawImage(
          atlas,
          p.glyph[picks[k]] * cell,
          projRow[k] * cell,
          cell,
          cell,
          projX[k] - s * 0.5,
          projY[k] - s * 0.5,
          s,
          s
        );
      }
      ctx.globalAlpha = 1;
    },
    dispose: () => {},
  };
}

export function ParticleSphere({
  className,
  count = 26000,
  glyphSize = 5,
  /** "dome" drops the centre below the frame so only the lit cap rises into
   * view (hero); "full" keeps the whole planet inside its box. */
  framing = "dome",
  halo = "offset",
}: {
  className?: string;
  count?: number;
  glyphSize?: number;
  framing?: "dome" | "full";
  halo?: "offset" | "center" | "none";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = framing === "full";
    // phones need denser points — a thinned shell reads as empty teal void
    const n = Math.round(
      count * (window.innerWidth < 640 ? 0.55 : window.innerWidth < 1024 ? 0.65 : 1)
    );

    const particles = buildParticles(n, full);
    // #region agent log
    const glOk = glPipelineWorks();
    const glRenderer = glOk ? createGLRenderer(canvas, particles) : null;
    const renderer = glRenderer ?? create2DRenderer(canvas, particles);
    debugLog(
      "sphere-renderer",
      {
        framing,
        points: n,
        glPipeline: glOk,
        mode: glRenderer ? "gl" : renderer ? "2d" : "none",
        w: window.innerWidth,
        dpr: window.devicePixelRatio,
      },
      "B"
    );
    // #endregion
    if (!renderer) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let frame = 0;
    // the clock only starts once the canvas is on screen, so a planet further
    // down the page still assembles in front of the reader
    let start = performance.now();
    let started = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // phones need a sharper glyph atlas; desktop stays cheaper at 1.5x
      dpr = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 640 ? 2.25 : 1.5
      );
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      renderer.resize();
    };

    resize();
    // glyph metrics change once Inter finishes loading
    document.fonts?.ready.then(() => renderer.refreshAtlas());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          start = performance.now();
        }
      },
      { rootMargin: "150px" }
    );
    intersectionObserver.observe(canvas);

    // #region agent log
    let framesLogged = false;
    // #endregion

    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!visible || width === 0) return;

      // #region agent log
      if (!framesLogged) {
        framesLogged = true;
        debugLog("sphere-first-frame", { framing, width, height, dpr }, "B");
      }
      // #endregion

      const elapsed = (now - start) / 1000;
      const gather = reduceMotion ? 1 : Math.min(elapsed / (full ? 2.1 : 2.6), 1);
      // keeps the first frame from flashing the whole cloud into existence
      const intro = reduceMotion ? 1 : Math.min(elapsed / 0.4, 1);

      // the planet swells slightly as it consolidates
      const swell = 0.9 + easeOutCubic(gather) * 0.1;
      const mobile = width < 640;
      // leave a soft margin on the full mobile stage so the shell never clips
      // into a hard rectangular edge
      const radius =
        (full
          ? Math.min(width, height) * (mobile ? 0.42 : 0.46)
          : mobile
            ? Math.min(width, height) * 0.48
            : Math.min(width * 0.42, height * 0.33)) * swell;

      renderer.draw({
        width,
        height,
        dpr,
        gather,
        intro,
        spin: reduceMotion ? 0.6 : elapsed * 0.075,
        tilt: mobile && !full ? -0.22 : -0.32,
        radius,
        cx: width * 0.5,
        cy: full ? height * 0.5 : mobile ? height * 0.56 : height * 0.98,
        fov: 3.1,
        // oversized points on phones fused into a white blob
        glyphSize: mobile ? glyphSize * 1.1 : glyphSize,
      });
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.dispose();
    };
  }, [count, glyphSize, framing]);

  return (
    <div className={cn("relative", className)}>
      {halo !== "none" && (
        <div
          className={cn(
            "animate-halo pointer-events-none absolute rounded-full",
            halo === "offset"
              ? "left-1/2 top-[48%] h-[58%] w-[78%] -translate-x-1/2 sm:left-auto sm:right-[8%] sm:top-[58%] sm:h-[36%] sm:w-[54%] sm:translate-x-0"
              : "left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2"
          )}
          style={{
            background:
              "radial-gradient(circle, rgba(0,160,150,0.22) 0%, rgba(0,120,112,0.1) 45%, rgba(1,38,36,0) 72%)",
            filter: "blur(36px)",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="relative h-full w-full bg-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
