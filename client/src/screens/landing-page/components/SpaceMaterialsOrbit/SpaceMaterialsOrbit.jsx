import { useCallback, useEffect, useRef, useState } from 'react';
import './SpaceMaterialsOrbit.css';

import asteroidSrc from '../../../../assets/images/icons/space_material/asteroid.png';
import meteoriteSrc from '../../../../assets/images/icons/space_material/meteorite.png';
import ufoSrc from '../../../../assets/images/icons/space_material/ufo.png';
import satelliteSrc from '../../../../assets/images/icons/space_material/satellite.png';

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function bezierPoint(t, p0, p1, p2) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function linearPoint(t, p0, p2) {
  return {
    x: p0.x + (p2.x - p0.x) * t,
    y: p0.y + (p2.y - p0.y) * t,
  };
}

function wobbleOffset(t, phase, amp) {
  return Math.sin(t * Math.PI * (2 + phase)) * amp * Math.sin(t * Math.PI);
}

/** Non-linear path (UFO only) */
function randomCurvedTrajectory() {
  const edge = Math.floor(Math.random() * 4);
  let p0;
  switch (edge) {
    case 0:
      p0 = { x: randomInRange(5, 95), y: -6 };
      break;
    case 1:
      p0 = { x: 106, y: randomInRange(5, 95) };
      break;
    case 2:
      p0 = { x: randomInRange(5, 95), y: 106 };
      break;
    default:
      p0 = { x: -6, y: randomInRange(5, 95) };
  }

  const exitEdge = Math.floor(Math.random() * 4);
  let p2;
  switch (exitEdge) {
    case 0:
      p2 = { x: randomInRange(5, 95), y: -8 };
      break;
    case 1:
      p2 = { x: 108, y: randomInRange(5, 95) };
      break;
    case 2:
      p2 = { x: randomInRange(5, 95), y: 108 };
      break;
    default:
      p2 = { x: -8, y: randomInRange(5, 95) };
  }

  const midx = (p0.x + p2.x) / 2 + randomInRange(-38, 38);
  const midy = (p0.y + p2.y) / 2 + randomInRange(-38, 38);
  const p1 = {
    x: Math.min(118, Math.max(-18, midx)),
    y: Math.min(118, Math.max(-18, midy)),
  };

  return {
    p0,
    p1,
    p2,
    wobbleAmp: randomInRange(2, 9),
    wobblePhase: randomInRange(0, Math.PI * 2),
  };
}

/** Straight line: random edge → opposite edge */
function randomLinearTrajectory() {
  const startEdge = Math.floor(Math.random() * 4);
  let p0;
  switch (startEdge) {
    case 0:
      p0 = { x: randomInRange(8, 92), y: -6 };
      break;
    case 1:
      p0 = { x: 106, y: randomInRange(8, 92) };
      break;
    case 2:
      p0 = { x: randomInRange(8, 92), y: 106 };
      break;
    default:
      p0 = { x: -6, y: randomInRange(8, 92) };
  }

  const endEdge = (startEdge + 2) % 4;
  let p2;
  switch (endEdge) {
    case 0:
      p2 = { x: randomInRange(8, 92), y: -8 };
      break;
    case 1:
      p2 = { x: 108, y: randomInRange(8, 92) };
      break;
    case 2:
      p2 = { x: randomInRange(8, 92), y: 108 };
      break;
    default:
      p2 = { x: -8, y: randomInRange(8, 92) };
  }

  return { p0, p2 };
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createLinearItem(src) {
  const { p0, p2 } = randomLinearTrajectory();
  return {
    id: newId(),
    kind: 'linear',
    src,
    p0,
    p2,
    progress: 0,
    baseSpeed: randomInRange(0.11, 0.2),
    speedMult: 1,
    size: randomInRange(28, 78),
    opacity: randomInRange(0.5, 0.9),
    rotation: randomInRange(-12, 12),
    hovered: false,
  };
}

function createUfoItem() {
  const { p0, p1, p2, wobbleAmp, wobblePhase } = randomCurvedTrajectory();
  return {
    id: newId(),
    kind: 'ufo',
    src: ufoSrc,
    p0,
    p1,
    p2,
    wobbleAmp,
    wobblePhase,
    progress: 0,
    baseSpeed: randomInRange(0.034, 0.068),
    speedMult: 1,
    ufoOffsetX: 0,
    ufoOffsetY: 0,
    ufoVelX: 0,
    ufoVelY: 0,
    size: randomInRange(24, 118),
    opacity: randomInRange(0.5, 0.92),
    rotation: randomInRange(-14, 14),
    hovered: false,
  };
}

/**
 * Satellites in one row: same straight line as meteorite (edge → opposite edge),
 * spaced perpendicular to travel. Shared speed (no fixed duration).
 * Staggered: each appears one after another; the whole row only starts moving after the last one is visible.
 */
function createSatelliteRowBatch(count) {
  const { p0, p2 } = randomLinearTrajectory();
  const baseSpeed = randomInRange(0.11, 0.2);
  const rowSpacing = randomInRange(4.5, 7.5);
  const dx = p2.x - p0.x;
  const dy = p2.y - p0.y;
  const pathAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  const batchT0 = performance.now();
  const staggerMs = randomInRange(320, 480);
  const holdAfterLastVisibleMs = randomInRange(380, 600);
  const lastVisibleAt = batchT0 + (count - 1) * staggerMs;
  const motionStartAt = lastVisibleAt + holdAfterLastVisibleMs;

  const batch = [];
  for (let i = 0; i < count; i++) {
    const rowSlot = i - (count - 1) / 2;
    batch.push({
      id: newId(),
      kind: 'satellite',
      src: satelliteSrc,
      p0,
      p2,
      rowSlot,
      rowSpacing,
      progress: 0,
      baseSpeed,
      speedMult: 1,
      size: randomInRange(28, 76),
      opacity: randomInRange(0.5, 0.88),
      rotation: pathAngleDeg + randomInRange(-5, 5),
      hovered: false,
      visibleAt: batchT0 + i * staggerMs,
      motionStartAt,
    });
  }
  return batch;
}

function countByKind(items, kind) {
  return items.filter((i) => i.kind === kind).length;
}

/** Hard limits so the layer never floods the screen */
const MAX_TOTAL_OBJECTS = 5;
const MAX_UFO = 1;
const MAX_LINEAR = 1;
/** One satellite formation at a time; small row only */
const SATELLITES_PER_BATCH = 2;
const SPAWN_GAP_MIN_MS = 18_000;
const SPAWN_GAP_MAX_MS = 32_000;
const FIRST_SPAWN_DELAY_MIN_MS = 2500;
const FIRST_SPAWN_DELAY_MAX_MS = 6000;
const COOLDOWN_AFTER_BATCH_MIN_MS = 12_000;
const COOLDOWN_AFTER_BATCH_MAX_MS = 22_000;
const RETRY_WHEN_FULL_MIN_MS = 3500;
const RETRY_WHEN_FULL_MAX_MS = 7500;
const RETRY_WHEN_SKIPPED_MIN_MS = 2000;
const RETRY_WHEN_SKIPPED_MAX_MS = 5000;

export default function SpaceMaterialsOrbit() {
  const [hasStarted, setHasStarted] = useState(false);
  const [renderItems, setRenderItems] = useState([]);
  const itemsRef = useRef([]);
  const elRefs = useRef({});
  /** Latest pointer (client coords) per UFO — physics runs in rAF, not on every mousemove */
  const ufoPointerRef = useRef({});
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const nextSpawnRef = useRef(null);

  const syncRenderFromRef = useCallback(() => {
    setRenderItems([...itemsRef.current]);
  }, []);

  useEffect(() => {
    const launchDelay = window.setTimeout(() => setHasStarted(true), 5000);
    return () => window.clearTimeout(launchDelay);
  }, []);

  useEffect(() => {
    if (!hasStarted) return undefined;

    const scheduleNextSpawnAttempt = (delayMs) => {
      if (nextSpawnRef.current) clearTimeout(nextSpawnRef.current);
      nextSpawnRef.current = window.setTimeout(() => {
        trySpawnOne();
      }, delayMs);
    };

    const trySpawnOne = () => {
      const list = itemsRef.current;
      const total = list.length;

      if (total >= MAX_TOTAL_OBJECTS) {
        scheduleNextSpawnAttempt(randomInRange(RETRY_WHEN_FULL_MIN_MS, RETRY_WHEN_FULL_MAX_MS));
        return;
      }

      const ufoN = countByKind(list, 'ufo');
      const linearN = countByKind(list, 'linear');
      const satN = countByKind(list, 'satellite');
      const roll = Math.random();

      let addedCount = 0;

      const tryAddUfo = () => {
        if (ufoN >= MAX_UFO || total + addedCount >= MAX_TOTAL_OBJECTS) return false;
        itemsRef.current = [...itemsRef.current, createUfoItem()];
        addedCount += 1;
        return true;
      };

      const tryAddLinear = () => {
        if (linearN >= MAX_LINEAR || total + addedCount >= MAX_TOTAL_OBJECTS) return false;
        const src = Math.random() > 0.5 ? asteroidSrc : meteoriteSrc;
        itemsRef.current = [...itemsRef.current, createLinearItem(src)];
        addedCount += 1;
        return true;
      };

      const tryAddSatelliteBatch = () => {
        if (satN > 0) return false;
        const n = SATELLITES_PER_BATCH;
        if (total + addedCount + n > MAX_TOTAL_OBJECTS) return false;
        itemsRef.current = [...itemsRef.current, ...createSatelliteRowBatch(n)];
        addedCount += n;
        return true;
      };

      /**
       * Prefer variety: UFO vs linear vs satellite formation.
       * Caps + global total prevent stacking; fallbacks only when primary pick is full.
       */
      if (roll < 0.45) {
        if (!tryAddUfo()) {
          if (!tryAddLinear()) tryAddSatelliteBatch();
        }
      } else if (roll < 0.78) {
        if (!tryAddLinear()) {
          if (!tryAddUfo()) tryAddSatelliteBatch();
        }
      } else {
        if (!tryAddSatelliteBatch()) {
          if (!tryAddUfo()) tryAddLinear();
        }
      }

      if (addedCount > 0) {
        syncRenderFromRef();
        const baseGap = randomInRange(SPAWN_GAP_MIN_MS, SPAWN_GAP_MAX_MS);
        const batchExtra =
          addedCount > 1
            ? randomInRange(COOLDOWN_AFTER_BATCH_MIN_MS, COOLDOWN_AFTER_BATCH_MAX_MS)
            : 0;
        scheduleNextSpawnAttempt(baseGap + batchExtra);
      } else {
        scheduleNextSpawnAttempt(randomInRange(RETRY_WHEN_SKIPPED_MIN_MS, RETRY_WHEN_SKIPPED_MAX_MS));
      }
    };

    scheduleNextSpawnAttempt(randomInRange(FIRST_SPAWN_DELAY_MIN_MS, FIRST_SPAWN_DELAY_MAX_MS));

    const applyPositions = () => {
      for (const item of itemsRef.current) {
        const el = elRefs.current[item.id];
        if (!el) continue;
        const t = Math.max(0, Math.min(1, item.progress));
        let x;
        let y;
        let rot;

        if (item.kind === 'linear') {
          const pt = linearPoint(t, item.p0, item.p2);
          x = pt.x;
          y = pt.y;
          rot = item.rotation;
        } else if (item.kind === 'satellite') {
          const pt = linearPoint(t, item.p0, item.p2);
          const dx = item.p2.x - item.p0.x;
          const dy = item.p2.y - item.p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const px = -dy / len;
          const py = dx / len;
          const slot = item.rowSlot ?? 0;
          const gap = item.rowSpacing ?? 5;
          x = pt.x + px * slot * gap;
          y = pt.y + py * slot * gap;
          rot = item.rotation;
          const now = performance.now();
          const vis = item.visibleAt == null || now >= item.visibleAt;
          el.style.opacity = String(vis ? item.opacity : 0);
        } else {
          const pt = bezierPoint(t, item.p0, item.p1, item.p2);
          const wx = wobbleOffset(t, item.wobblePhase, item.wobbleAmp);
          const wy = wobbleOffset(t, item.wobblePhase + 1.7, item.wobbleAmp * 0.9);
          x = pt.x + wx;
          y = pt.y + wy;
          rot = item.rotation + t * 22;
        }

        if (item.kind === 'ufo') {
          x += item.ufoOffsetX ?? 0;
          y += item.ufoOffsetY ?? 0;
        }

        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        if (item.kind !== 'satellite') {
          el.style.opacity = String(item.opacity);
        }
        el.style.setProperty('--material-rot', `${rot}deg`);
      }
    };

    const loop = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      let listChanged = false;
      const next = [];

      for (const item of itemsRef.current) {
        const dir = 1;
        let spd = item.baseSpeed * item.speedMult;
        if (item.kind === 'ufo' && item.hovered) spd *= 0.55;

        let p = item.progress + dt * spd * dir;

        if (
          item.kind === 'satellite' &&
          item.motionStartAt != null &&
          performance.now() < item.motionStartAt
        ) {
          p = 0;
        }

        if (p > 1) {
          listChanged = true;
          delete elRefs.current[item.id];
          continue;
        }

        let updated = { ...item, progress: p };

        if (item.kind === 'ufo') {
          const el = elRefs.current[item.id];
          const ptr = ufoPointerRef.current[item.id];
          let vx = item.ufoVelX ?? 0;
          let vy = item.ufoVelY ?? 0;
          let ox = item.ufoOffsetX ?? 0;
          let oy = item.ufoOffsetY ?? 0;

          if (item.hovered && ptr && el) {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = cx - ptr.x;
            const dy = cy - ptr.y;
            const dist = Math.hypot(dx, dy) || 1;
            const ux = dx / dist;
            const uy = dy / dist;
            const proximity = Math.min(1.85, 140 / Math.max(18, dist));
            const accel = 48 * proximity;
            vx += ux * accel * dt;
            vy += uy * accel * dt;
          }

          const maxV = 36;
          const vMag = Math.hypot(vx, vy);
          if (vMag > maxV) {
            vx = (vx / vMag) * maxV;
            vy = (vy / vMag) * maxV;
          }

          const spring = 2.2;
          vx -= ox * spring * dt;
          vy -= oy * spring * dt;

          const drag = item.hovered ? 0.991 : 0.94;
          vx *= Math.pow(drag, dt * 60);
          vy *= Math.pow(drag, dt * 60);

          ox += vx * dt;
          oy += vy * dt;

          const cap = 14;
          ox = Math.max(-cap, Math.min(cap, ox));
          oy = Math.max(-cap, Math.min(cap, oy));

          updated = {
            ...updated,
            ufoOffsetX: ox,
            ufoOffsetY: oy,
            ufoVelX: vx,
            ufoVelY: vy,
          };
        }

        next.push(updated);
      }

      itemsRef.current = next;
      if (listChanged) {
        syncRenderFromRef();
      }

      applyPositions();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      if (nextSpawnRef.current) clearTimeout(nextSpawnRef.current);
      itemsRef.current = [];
      elRefs.current = {};
      ufoPointerRef.current = {};
      setRenderItems([]);
    };
  }, [hasStarted, syncRenderFromRef]);

  const handleUfoPointerMove = useCallback((e, id) => {
    ufoPointerRef.current[id] = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerEnter = useCallback((id, e) => {
    const kind = itemsRef.current.find((i) => i.id === id)?.kind;
    if (kind === 'ufo' && e) {
      ufoPointerRef.current[id] = { x: e.clientX, y: e.clientY };
    }
    itemsRef.current = itemsRef.current.map((it) =>
      it.id === id ? { ...it, hovered: true } : it
    );
    setRenderItems([...itemsRef.current]);
  }, []);

  const handlePointerLeave = useCallback((id) => {
    delete ufoPointerRef.current[id];
    itemsRef.current = itemsRef.current.map((it) => (it.id === id ? { ...it, hovered: false } : it));
    setRenderItems([...itemsRef.current]);
  }, []);

  const handleClick = useCallback((e) => {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    e.stopPropagation();
    itemsRef.current = itemsRef.current.map((it) => {
      if (it.id !== id) return it;
      return { ...it, speedMult: Math.min(5.5, it.speedMult + 1.1) };
    });
  }, []);

  const setElRef = useCallback((id) => (el) => {
    if (el) elRefs.current[id] = el;
    else delete elRefs.current[id];
  }, []);

  if (!hasStarted) return null;

  return (
    <div className="space-materials-layer" aria-hidden="true">
      {renderItems.map((item) => (
        <div
          key={item.id}
          ref={setElRef(item.id)}
          className={`space-material-drift space-material-drift--${item.kind} ${
            item.hovered ? 'is-hovered' : ''
          }`}
          data-id={item.id}
          data-kind={item.kind}
          style={{
            width: `${item.size}px`,
            height: `${item.size * 0.9}px`,
            '--material-rot': '0deg',
          }}
          onPointerEnter={(e) => handlePointerEnter(item.id, e)}
          onPointerLeave={() => handlePointerLeave(item.id)}
          onPointerMove={item.kind === 'ufo' ? (e) => handleUfoPointerMove(e, item.id) : undefined}
          onClick={handleClick}
          role="presentation"
        >
          <img src={item.src} alt="" className="space-material-asset" loading="lazy" draggable={false} />
        </div>
      ))}
    </div>
  );
}
