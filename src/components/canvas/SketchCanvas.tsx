
import type {
  InternalDiagrams,
  MechTask,
  SketchForce,
  SketchSupport,
} from "@/lib/types";
import { Minus, Plus, RotateCcw, Scan } from "lucide-react";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";

interface SketchCanvasProps {
  task: MechTask;
  showDiagrams?: boolean;
  /** skica = geometry + loads; fbd = add reaction arrows from solution symbols */
  viewMode?: "skica" | "fbd";
  onViewModeChange?: (m: "skica" | "fbd") => void;
}

export function SketchCanvas({
  task,
  showDiagrams = true,
  viewMode = "skica",
  onViewModeChange,
}: SketchCanvasProps) {
  const { sketch } = task;
  const vb = sketch.viewBox ?? "0 0 720 400";
  const [vbW, vbH] = useMemo(() => {
    const p = vb.split(/\s+/).map(Number);
    return [p[2] || 720, p[3] || 400];
  }, [vb]);

  const showNtm =
    showDiagrams &&
    (task.course === "mdt" || Boolean(sketch.diagrams)) &&
    sketch.diagrams;

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(
    null,
  );

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setScale((s) => Math.min(3, Math.max(0.45, s + delta)));
    },
    [],
  );

  const onPointerDown = (e: PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.panX + (e.clientX - drag.current.x),
      y: drag.current.panY + (e.clientY - drag.current.y),
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const reactionForces = viewMode === "fbd" ? buildReactionForces(task) : [];
  const isFbd = viewMode === "fbd";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-cyan-800/40 bg-[#07111f]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px),
            linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,8,20,0.55)_100%)]" />

      <div className="absolute right-2 top-2 z-20 flex flex-wrap items-center justify-end gap-1">
        <div className="mr-1 flex overflow-hidden rounded border border-cyan-800/50 bg-slate-950/80 text-[10px] uppercase tracking-wider">
          <button
            type="button"
            className={`px-2 py-1 ${!isFbd ? "bg-cyan-500/20 text-cyan-100" : "text-slate-400"}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewModeChange?.("skica");
            }}
          >
            Skica
          </button>
          <button
            type="button"
            className={`px-2 py-1 ${isFbd ? "bg-amber-500/30 text-amber-50" : "text-slate-400"}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewModeChange?.("fbd");
            }}
          >
            FBD{isFbd ? ` (${reactionForces.length})` : ""}
          </button>
        </div>
        <IconBtn onClick={() => setScale((s) => Math.min(3, s + 0.15))} label="Zoom +">
          <Plus className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn onClick={() => setScale((s) => Math.max(0.45, s - 0.15))} label="Zoom −">
          <Minus className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn onClick={resetView} label="Reset">
          <RotateCcw className="h-3.5 w-3.5" />
        </IconBtn>
      </div>

      <div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg
          viewBox={vb}
          className="h-full w-full"
          role="img"
          aria-label={`Skica: ${task.title}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          <defs>
            <marker
              id="arrowHead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="context-stroke" />
            </marker>
            <marker
              id="arrowHeadAmber"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Axes hint */}
          <g opacity="0.5">
            <line x1="24" y1={vbH - 24} x2="64" y2={vbH - 24} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
            <line x1="24" y1={vbH - 24} x2="24" y2={vbH - 64} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowHead)" />
            <text x="68" y={vbH - 20} fill="#94a3b8" fontSize="11">x</text>
            <text x="18" y={vbH - 68} fill="#94a3b8" fontSize="11">y</text>
          </g>

          {sketch.elements.map((el) => {
            const pts = el.points.map((p) => `${p.x},${p.y}`).join(" ");
            const isCable = el.kind === "cable";
            const stroke =
              el.kind === "truss" || el.kind === "rod"
                ? "#7dd3fc"
                : isCable
                  ? "#fcd34d"
                  : "#e2e8f0";
            return (
              <g key={el.id}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={el.kind === "beam" || el.kind === "frame" ? 4 : 2.5}
                  strokeDasharray={el.dashed || isCable ? "6 5" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                {el.label && el.points[0] && (
                  <text
                    x={(el.points[0].x + el.points[el.points.length - 1].x) / 2}
                    y={
                      (el.points[0].y + el.points[el.points.length - 1].y) / 2 - 10
                    }
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    {el.label}
                  </text>
                )}
              </g>
            );
          })}

          {sketch.supports.map((s) => (
            <SupportGlyph key={s.id} support={s} />
          ))}

          {/* Applied loads — dimmed in FBD so reactions stand out */}
          <g opacity={isFbd ? 0.28 : 1}>
            {sketch.forces.map((f) => (
              <ForceGlyph key={f.id} force={f} />
            ))}
          </g>

          {isFbd &&
            reactionForces.map((f) => (
              <ReactionGlyph key={`rxn-${f.id}`} force={f} />
            ))}

          {sketch.labels.map((l, i) => (
            <text
              key={`${l.text}-${i}`}
              x={l.at.x}
              y={l.at.y}
              fill={l.kind === "dim" ? "#67e8f9" : "#cbd5e1"}
              fontSize={l.kind === "note" ? 12 : 13}
              fontFamily="var(--font-display)"
              fontWeight={600}
            >
              {l.text}
            </text>
          ))}

          {showNtm && sketch.diagrams && (
            <InternalForceDiagrams
              diagrams={sketch.diagrams}
              beam={sketch.elements.find((e) => e.kind === "beam" || e.kind === "frame")}
            />
          )}

          {viewMode === "fbd" && (
            <g>
              <rect
                x="12"
                y="12"
                width="120"
                height="22"
                rx="4"
                fill="rgba(245,158,11,0.15)"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text x="20" y="27" fill="#fbbf24" fontSize="11" fontWeight="700">
                FBD — reakcije
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2">
        <span className="rounded border border-cyan-800/50 bg-slate-950/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">
          {task.mode === "3d" ? "3D sustav" : "2D sustav"}
        </span>
        <span className="rounded border border-cyan-800/50 bg-slate-950/70 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300">
          {task.course === "mehanika1"
            ? "Mehanika 1"
            : task.course === "mehanika2"
              ? "Mehanika 2"
              : "MDT"}
        </span>
        <span className="hidden items-center gap-1 rounded border border-slate-700/50 bg-slate-950/70 px-2 py-1 text-[10px] text-slate-400 sm:inline-flex">
          <Scan className="h-3 w-3" /> pan · scroll zoom
        </span>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded border border-cyan-800/50 bg-slate-950/80 p-1.5 text-cyan-100 hover:bg-cyan-950/50"
    >
      {children}
    </button>
  );
}

function buildReactionForces(task: MechTask): SketchForce[] {
  const out: SketchForce[] = [];
  for (const s of task.sketch.supports) {
    const at = s.at;
    if (s.kind === "pin" || s.kind === "hinge") {
      out.push({
        id: `${s.id}-Fx`,
        at: { x: at.x - 8, y: at.y },
        angleDeg: 180,
        magnitude: 1,
        unit: "",
        label: `F${s.id}x`,
        color: "#fbbf24",
      });
      out.push({
        id: `${s.id}-Fy`,
        at: { x: at.x, y: at.y + 8 },
        angleDeg: 90,
        magnitude: 1,
        unit: "",
        label: `F${s.id}y`,
        color: "#fbbf24",
      });
    } else if (s.kind === "roller") {
      const vert = (s.orientationDeg ?? 0) === 90;
      out.push({
        id: `${s.id}-F`,
        at,
        angleDeg: vert ? 0 : 90,
        magnitude: 1,
        unit: "",
        label: `F${s.id}`,
        color: "#fbbf24",
      });
    } else if (s.kind === "fixed" || s.kind === "clamp") {
      out.push({
        id: `${s.id}-Fx`,
        at: { x: at.x + 10, y: at.y },
        angleDeg: 0,
        magnitude: 1,
        unit: "",
        label: `F${s.id}x`,
        color: "#fbbf24",
      });
      out.push({
        id: `${s.id}-Fy`,
        at: { x: at.x, y: at.y - 10 },
        angleDeg: 90,
        magnitude: 1,
        unit: "",
        label: `F${s.id}y`,
        color: "#fbbf24",
      });
      out.push({
        id: `${s.id}-M`,
        at: { x: at.x + 30, y: at.y - 20 },
        angleDeg: 0,
        magnitude: 1,
        unit: "",
        label: `M${s.id}`,
        kind: "moment",
        sense: "ccw",
        color: "#fbbf24",
      });
    }
  }
  return out;
}

function SupportGlyph({ support }: { support: SketchSupport }) {
  const { at, kind, label } = support;
  const x = at.x;
  const y = at.y;

  if (kind === "pin" || kind === "hinge") {
    return (
      <g>
        <polygon
          points={`${x},${y} ${x - 14},${y + 22} ${x + 14},${y + 22}`}
          fill="#0f172a"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        <circle cx={x} cy={y} r="5" fill="#022c3a" stroke="#67e8f9" strokeWidth="2" />
        <line x1={x - 18} y1={y + 22} x2={x + 18} y2={y + 22} stroke="#64748b" strokeWidth="2" />
        {hatch(x - 18, y + 22, 36)}
        {label && (
          <text x={x - 16} y={y - 10} fill="#f8fafc" fontSize="13" fontWeight="700">
            {label}
          </text>
        )}
      </g>
    );
  }

  if (kind === "roller") {
    const vert = (support.orientationDeg ?? 0) === 90;
    return (
      <g>
        <polygon
          points={
            vert
              ? `${x},${y} ${x - 22},${y - 14} ${x - 22},${y + 14}`
              : `${x},${y} ${x - 14},${y + 18} ${x + 14},${y + 18}`
          }
          fill="#0f172a"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        {!vert && (
          <>
            <circle cx={x - 8} cy={y + 26} r="5" fill="none" stroke="#67e8f9" strokeWidth="2" />
            <circle cx={x + 8} cy={y + 26} r="5" fill="none" stroke="#67e8f9" strokeWidth="2" />
            <line
              x1={x - 20}
              y1={y + 34}
              x2={x + 20}
              y2={y + 34}
              stroke="#64748b"
              strokeWidth="2"
            />
            {hatch(x - 20, y + 34, 40)}
          </>
        )}
        {label && (
          <text x={x + 12} y={y - 8} fill="#f8fafc" fontSize="13" fontWeight="700">
            {label}
          </text>
        )}
      </g>
    );
  }

  if (kind === "fixed" || kind === "clamp") {
    return (
      <g>
        <line x1={x} y1={y - 28} x2={x} y2={y + 28} stroke="#22d3ee" strokeWidth="4" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1={x}
            y1={y - 24 + i * 8}
            x2={x - 12}
            y2={y - 18 + i * 8}
            stroke="#64748b"
            strokeWidth="2"
          />
        ))}
        {label && (
          <text x={x + 10} y={y - 20} fill="#f8fafc" fontSize="13" fontWeight="700">
            {label}
          </text>
        )}
      </g>
    );
  }

  return null;
}

function hatch(x: number, y: number, w: number) {
  return Array.from({ length: Math.floor(w / 6) }).map((_, i) => (
    <line
      key={i}
      x1={x + i * 6}
      y1={y}
      x2={x + i * 6 - 6}
      y2={y + 8}
      stroke="#475569"
      strokeWidth="1.5"
    />
  ));
}

/** Explicit arrowhead — avoids marker/context-stroke browser quirks in FBD. */
function ReactionGlyph({ force }: { force: SketchForce }) {
  const color = "#fbbf24";
  const { at } = force;
  if (force.kind === "moment") {
    const r = 32;
    return (
      <g>
        <path
          d={`M ${at.x - r} ${at.y} A ${r} ${r} 0 1 0 ${at.x + r * 0.75} ${at.y - r * 0.65}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
        />
        <polygon
          points={`${at.x + r * 0.75},${at.y - r * 0.65} ${at.x + r * 0.45},${at.y - r * 0.95} ${at.x + r * 0.95},${at.y - r * 0.85}`}
          fill={color}
        />
        <text x={at.x + 10} y={at.y - 40} fill={color} fontSize="14" fontWeight="800">
          {force.label}
        </text>
      </g>
    );
  }
  const len = 58;
  const rad = (force.angleDeg * Math.PI) / 180;
  const x2 = at.x + Math.cos(rad) * len;
  const y2 = at.y - Math.sin(rad) * len;
  const ux = Math.cos(rad);
  const uy = -Math.sin(rad);
  const px = -uy;
  const py = ux;
  const tip = `${x2},${y2}`;
  const left = `${x2 - ux * 12 + px * 6},${y2 - uy * 12 + py * 6}`;
  const right = `${x2 - ux * 12 - px * 6},${y2 - uy * 12 - py * 6}`;
  return (
    <g>
      <line
        x1={at.x}
        y1={at.y}
        x2={x2 - ux * 10}
        y2={y2 - uy * 10}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <polygon points={`${tip} ${left} ${right}`} fill={color} />
      <circle cx={at.x} cy={at.y} r="4" fill="#0f172a" stroke={color} strokeWidth="2" />
      <text
        x={x2 + ux * 14}
        y={y2 + uy * 14}
        fill={color}
        fontSize="14"
        fontWeight="800"
        style={{ paintOrder: "stroke", stroke: "#07111f", strokeWidth: 3 }}
      >
        {force.label}
      </text>
    </g>
  );
}

function ForceGlyph({ force }: { force: SketchForce }) {
  const color = force.color ?? "#f87171";
  const { at } = force;

  if (force.kind === "distributed" && force.length) {
    const n = 6;
    const arrows = Array.from({ length: n }).map((_, i) => {
      const x = at.x + (force.length! * i) / (n - 1);
      return (
        <line
          key={i}
          x1={x}
          y1={at.y - 48}
          x2={x}
          y2={at.y - 6}
          stroke={color}
          strokeWidth="2"
          markerEnd="url(#arrowHead)"
        />
      );
    });
    return (
      <g>
        <line
          x1={at.x}
          y1={at.y - 48}
          x2={at.x + force.length}
          y2={at.y - 48}
          stroke={color}
          strokeWidth="2"
        />
        {arrows}
        <text
          x={at.x + force.length / 2}
          y={at.y - 58}
          fill={color}
          fontSize="13"
          fontWeight="700"
          textAnchor="middle"
        >
          {force.label}
          {force.magnitude ? ` = ${force.magnitude} ${force.unit}` : ""}
        </text>
      </g>
    );
  }

  if (force.kind === "moment") {
    const r = 28;
    const sweep = force.sense === "cw" ? 1 : 0;
    return (
      <g>
        <path
          d={`M ${at.x - r} ${at.y} A ${r} ${r} 0 1 ${sweep} ${at.x + r * 0.7} ${at.y - r * 0.7}`}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          markerEnd="url(#arrowHead)"
        />
        <text x={at.x + 8} y={at.y - 36} fill={color} fontSize="13" fontWeight="700">
          {force.label}
          {force.unit ? ` = ${force.magnitude} ${force.unit}` : ""}
        </text>
      </g>
    );
  }

  const len = force.unit === "" ? 42 : 56;
  const rad = (force.angleDeg * Math.PI) / 180;
  const x2 = at.x + Math.cos(rad) * len;
  const y2 = at.y - Math.sin(rad) * len;

  return (
    <g>
      <line
        x1={at.x}
        y1={at.y}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2.8"
        markerEnd="url(#arrowHead)"
        filter="url(#glow)"
      />
      <circle cx={at.x} cy={at.y} r="3" fill={color} />
      <text
        x={x2 + Math.cos(rad) * 8}
        y={y2 - Math.sin(rad) * 8}
        fill={color}
        fontSize="12"
        fontWeight="700"
      >
        {force.label}
      </text>
    </g>
  );
}

function InternalForceDiagrams({
  diagrams,
  beam,
}: {
  diagrams: InternalDiagrams;
  beam?: { points: { x: number; y: number }[] };
}) {
  if (!beam || beam.points.length < 2) return null;
  const x0 = beam.points[0].x;
  const x1 = beam.points[beam.points.length - 1].x;
  const yBase = Math.max(...beam.points.map((p) => p.y)) + 100;
  const span = x1 - x0;
  const xs = diagrams.stations.map((s) => s.x);
  const xMax = Math.max(...xs, 1);
  const toX = (x: number) => x0 + (x / xMax) * span;

  const plot = (
    key: "N" | "T" | "M",
    y: number,
    color: string,
    maxAbs: number,
  ) => {
    const pts = diagrams.stations
      .map((s) => {
        const v = s[key] ?? 0;
        const py = y - (v / Math.max(maxAbs, 1e-6)) * 40;
        return `${toX(s.x)},${py}`;
      })
      .join(" ");
    return (
      <g key={key}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#334155" strokeWidth="1" />
        <text x={x0 - 24} y={y + 4} fill={color} fontSize="12" fontWeight="700">
          {key}
        </text>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" />
        {diagrams.stations.map((s, i) => {
          const v = s[key] ?? 0;
          if (Math.abs(v) < 1e-9) return null;
          const py = y - (v / Math.max(maxAbs, 1e-6)) * 40;
          return (
            <g key={`${key}-${i}`}>
              <circle cx={toX(s.x)} cy={py} r="2.5" fill={color} />
              {(i === 0 ||
                i === diagrams.stations.length - 1 ||
                Math.abs(v) ===
                  Math.max(...diagrams.stations.map((d) => Math.abs(d[key] ?? 0)))) && (
                <text
                  x={toX(s.x) + 4}
                  y={py - 6}
                  fill={color}
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {Number(v.toFixed(2))}
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const maxT = diagrams.maxT || 1;
  const maxM = diagrams.maxM || 1;
  const maxN = diagrams.maxN || 1;

  return (
    <g>
      <text
        x={x0}
        y={yBase - 70}
        fill="#94a3b8"
        fontSize="11"
        fontFamily="var(--font-mono)"
      >
        Dijagrami unutarnjih sila (N, T, M)
      </text>
      {plot("N", yBase - 30, "#a78bfa", maxN)}
      {plot("T", yBase + 40, "#34d399", maxT)}
      {plot("M", yBase + 110, "#fbbf24", maxM)}
    </g>
  );
}
