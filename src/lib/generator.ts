import { BUILTIN_TASKS } from "@/data/tasks";
import type { Course, Difficulty, MechTask, Mode } from "@/lib/types";
import { fmt, round } from "@/lib/utils";

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function cloneTask(base: MechTask, overrides: Partial<MechTask>): MechTask {
  return {
    ...base,
    ...overrides,
    sketch: {
      ...base.sketch,
      ...(overrides.sketch ?? {}),
      elements: overrides.sketch?.elements ?? base.sketch.elements.map((e) => ({ ...e, points: e.points.map((p) => ({ ...p })) })),
      supports: overrides.sketch?.supports ?? base.sketch.supports.map((s) => ({ ...s, at: { ...s.at } })),
      forces: overrides.sketch?.forces ?? base.sketch.forces.map((f) => ({ ...f, at: { ...f.at } })),
      labels: overrides.sketch?.labels ?? base.sketch.labels.map((l) => ({ ...l, at: { ...l.at } })),
      diagrams: overrides.sketch?.diagrams ?? base.sketch.diagrams,
    },
    solution: overrides.solution ?? base.solution,
    given: overrides.given ?? [...base.given],
  };
}

/** Deterministic generator: consecutive seeds cycle distinct sketches + values. */
export function generateTask(
  course: Course,
  difficulty: Difficulty,
  mode: Mode,
  seed = Date.now(),
): MechTask {
  const pool = BUILTIN_TASKS.filter((t) => t.course === course);
  const fallback = BUILTIN_TASKS.filter((t) => t.course === "mehanika1");
  const sourcePool = pool.length ? pool : fallback;
  const preferMode = sourcePool.filter((t) => t.mode === mode);
  const base = pick(preferMode.length ? preferMode : sourcePool, seed);

  if (course === "mehanika1" && mode === "3d") {
    const frames = BUILTIN_TASKS.filter((t) => t.course === "mehanika1" && t.mode === "3d");
    const tmpl = pick(frames.length ? frames : [base], seed);
    const k = 1 + (seed % 7) * 0.12;
    const scaled = scaleForces(tmpl, k);
    return cloneTask(scaled, {
      id: `gen-m1-3d-${difficulty}-${seed}`,
      title: `3D okvir · k=${fmt(k, 2)} · gen #${seed}`,
      difficulty,
      mode: "3d",
    });
  }

  if (course === "mehanika1") {
    // beam / truss / cable / konzola / catalog-ispit clone
    const kind = seed % 5;
    if (kind === 1) return generateTrussVariant(difficulty, seed);
    if (kind === 2) return generateCableVariant(difficulty, seed);
    if (kind === 3) return generateCantileverVariant(difficulty, seed);
    if (kind === 4 && difficulty === "ispitni") {
      const ispit = BUILTIN_TASKS.filter(
        (t) => t.course === "mehanika1" && t.tags?.includes("ispit"),
      );
      if (ispit.length) {
        const tmpl = pick(ispit, seed);
        return cloneTask(scaleForces(tmpl, 1 + (seed % 4) * 0.1), {
          id: `gen-m1-ispit-${seed}`,
          title: `${tmpl.title} · gen #${seed}`,
          difficulty,
        });
      }
    }
    return generateStaticsVariant(base, difficulty, seed);
  }
  if (course === "mehanika2") {
    if (seed % 2 === 0) return generateKinematicsVariant(difficulty, seed);
    return generateMeh2Variant(base, difficulty, seed);
  }
  if (course === "mdt") {
    if (seed % 2 === 1) {
      const ntm = BUILTIN_TASKS.filter(
        (t) => t.course === "mdt" && t.sketch.diagrams,
      );
      if (ntm.length) {
        const tmpl = pick(ntm, seed);
        return cloneTask(scaleForces(tmpl, 1 + (seed % 3) * 0.15), {
          id: `gen-mdt-cat-${difficulty}-${seed}`,
          title: `${tmpl.title} · gen #${seed}`,
          difficulty,
        });
      }
    }
    return generateMdtVariant(base, difficulty, seed);
  }
  const scaled = scaleForces(base, 1 + (seed % 5) * 0.15);
  return cloneTask(scaled, {
    id: `gen-${course}-${difficulty}-${seed}`,
    title: `${base.title} · gen #${seed} · ${labelDiff(difficulty)}`,
    difficulty,
    mode,
  });
}

function labelDiff(d: Difficulty) {
  return d === "lako" ? "Lako" : d === "srednje" ? "Srednje" : "Ispitni rok";
}

function scaleForces(task: MechTask, k: number): MechTask {
  return cloneTask(task, {
    sketch: {
      ...task.sketch,
      forces: task.sketch.forces.map((f) => ({
        ...f,
        magnitude: round(f.magnitude * k, 2),
      })),
    },
  });
}

function generateStaticsVariant(
  base: MechTask,
  difficulty: Difficulty,
  seed: number,
): MechTask {
  // Avoid colliding with the built-in demo (a=1, q=10, M=10)
  const a = 1 + (seed % 3); // 1..3 m
  const qChoices = [5, 15, 20, 25, 30, 35];
  const q = qChoices[seed % qChoices.length];
  const F = round(2 * q * a, 2);
  const M = round(q * a * a, 2);
  const Q = round(q * 3 * a, 2);
  const FB = round((Q * 1.5 * a + F * 3 * a - M) / (8 * a), 3);
  const FAy = round(Q + F - FB, 3);

  const spanFactor = difficulty === "lako" ? 0.9 : difficulty === "ispitni" ? 1.1 : 1;
  const L = 560 * spanFactor;

  const task: MechTask = {
    id: `gen-m1-beam-${difficulty}-${seed}`,
    title: `Nosač q=${q} · F=${F} · gen #${seed}`,
    course: "mehanika1",
    mode: "2d",
    difficulty,
    statement:
      "Za nosač zadan i opterećen prema slici odrediti reakcije u A (zglob) i B (pokretni oslonac). Koristiti ΣFx = 0, ΣFy = 0, ΣMA = 0.",
    given: [
      `a = ${a} m`,
      `q = ${q} kN/m`,
      `F = 2qa = ${F} kN`,
      `M = qa² = ${M} kNm`,
      "duljine: 3a + 2a + 2a + a = 8a",
    ],
    sketch: {
      viewBox: "0 0 720 340",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 80, y: 160 },
            { x: 80 + L, y: 160 },
          ],
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 80, y: 160 }, label: "A" },
        {
          id: "B",
          kind: "roller",
          at: { x: 80 + L, y: 160 },
          label: "B",
        },
      ],
      forces: [
        {
          id: "q",
          at: { x: 80, y: 160 },
          angleDeg: -90,
          magnitude: q,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: L * (3 / 8),
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 80 + L * (3 / 8), y: 160 },
          angleDeg: -90,
          magnitude: F,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
        {
          id: "M",
          at: { x: 80 + L * (5 / 8), y: 160 },
          angleDeg: 0,
          magnitude: M,
          unit: "kNm",
          label: "M",
          kind: "moment",
          sense: "cw",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "3a", at: { x: 80 + L * 0.2, y: 210 }, kind: "dim" },
        { text: "2a", at: { x: 80 + L * 0.5, y: 210 }, kind: "dim" },
        { text: "2a", at: { x: 80 + L * 0.7, y: 210 }, kind: "dim" },
        { text: "a", at: { x: 80 + L * 0.9, y: 210 }, kind: "dim" },
      ],
    },
    solution: {
      styleNote: "FSB Mehanika I — generirani zadatak",
      summary:
        "Oslobađanje: FAx, FAy u zglobu A; FB u pokretnom osloncu B. Raspodjela q → rezultanta Q u težištu.",
      forces: [
        {
          id: "FAx",
          label: "FAx",
          direction: "+x",
          application: "A",
          why: "Zglob prenosi Fx i Fy.",
        },
        {
          id: "FAy",
          label: "FAy",
          direction: "+y",
          application: "A",
          why: "Zglob prenosi Fx i Fy.",
        },
        {
          id: "FB",
          label: "FB",
          direction: "+y",
          application: "B",
          why: "Pokretni oslonac — samo sila okomito na podlogu.",
        },
      ],
      equations: [
        "\\sum F_x = 0:\\quad F_{Ax} = 0",
        `\\sum F_y = 0:\\quad F_{Ay} + F_B - ${fmt(Q)} - ${fmt(F)} = 0`,
        `\\sum M_A = 0:\\quad F_B\\cdot 8a = ${fmt(Q)}\\cdot 1{,}5a + ${fmt(F)}\\cdot 3a - ${fmt(M)}`,
      ],
      steps: [
        {
          title: "1. Rezultanta raspodjele",
          body: "Q = q·3a u težištu segmenta (1,5a od A).",
          latex: [`Q = ${q}\\cdot ${3 * a} = ${fmt(Q)}\\ \\mathrm{kN}`],
        },
        {
          title: "2. ΣMA = 0 → FB",
          body: "Moment za A eliminira reakcije u A.",
          latex: [
            `F_B = \\dfrac{${fmt(Q)}\\cdot 1{,}5 + ${fmt(F)}\\cdot 3 - ${fmt(M)}}{8} = ${fmt(FB)}\\ \\mathrm{kN}`,
          ],
          note:
            FB >= 0
              ? "Pozitivan FB — pretpostavljeni smjer (↑) je točan."
              : "Negativan FB — stvarni smjer je suprotan pretpostavci.",
        },
        {
          title: "3. ΣFy = 0 → FAy",
          body: "Vertikalna ravnoteža.",
          latex: [
            `F_{Ay} = ${fmt(Q)} + ${fmt(F)} - ${fmt(FB)} = ${fmt(FAy)}\\ \\mathrm{kN}`,
          ],
        },
      ],
      results: [
        { symbol: "FAx", value: "0 kN", meaning: "nema Fx opterećenja" },
        {
          symbol: "FAy",
          value: `${fmt(FAy)} kN ↑`,
          meaning: "reakcija zgloba A",
        },
        {
          symbol: "FB",
          value: `${fmt(FB)} kN ↑`,
          meaning: "reakcija pokretnog oslonca B",
        },
      ],
    },
    tags: ["generirano", "nosač"],
  };

  if (difficulty === "ispitni") {
    task.statement +=
      " Dodatno: napišite kratko što bi se promijenilo da je u B uklještenje umjesto pokretnog oslonca.";
    task.solution.steps.push({
      title: "4. Napomena (ispitni)",
      body: "Uklještenje u B dodalo bi moment MB i horizontalnu reakciju — sustav bi postao statički neodređen bez deformacijskih uvjeta (MDT).",
    });
  }

  return task;
}

function generateTrussVariant(difficulty: Difficulty, seed: number): MechTask {
  const F = 8 + (seed % 5) * 4; // kN
  const ang = difficulty === "lako" ? 30 : difficulty === "srednje" ? 45 : 60;
  const rad = (ang * Math.PI) / 180;
  const FBC = round(F / Math.sin(rad), 2);
  const FAC = round(FBC * Math.cos(rad), 2);
  const FAB = FBC;

  return {
    id: `gen-m1-truss-${difficulty}-${seed}`,
    title: `Rešetka ABC · F=${F} kN · gen #${seed}`,
    course: "mehanika1",
    mode: "2d",
    difficulty,
    statement:
      "Za ravninsku rešetku ABC odrediti sile u štapovima metodom čvorova (FSB notacija).",
    given: [`F = ${F} kN`, `kutovi ${ang}°`, "AB = AC (jednakokraka)"],
    sketch: {
      viewBox: "0 0 640 360",
      elements: [
        {
          id: "AB",
          kind: "truss",
          points: [
            { x: 120, y: 280 },
            { x: 320, y: 100 },
          ],
          label: "AB",
        },
        {
          id: "AC",
          kind: "truss",
          points: [
            { x: 120, y: 280 },
            { x: 520, y: 280 },
          ],
          label: "AC",
        },
        {
          id: "BC",
          kind: "truss",
          points: [
            { x: 320, y: 100 },
            { x: 520, y: 280 },
          ],
          label: "BC",
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 120, y: 280 }, label: "A" },
        { id: "C", kind: "roller", at: { x: 520, y: 280 }, label: "C" },
      ],
      forces: [
        {
          id: "F",
          at: { x: 520, y: 280 },
          angleDeg: -90,
          magnitude: F,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "A", at: { x: 100, y: 310 }, kind: "point" },
        { text: "B", at: { x: 320, y: 80 }, kind: "point" },
        { text: "C", at: { x: 540, y: 310 }, kind: "point" },
        { text: `${ang}°`, at: { x: 200, y: 200 }, kind: "dim" },
      ],
    },
    solution: {
      styleNote: "FSB — metoda čvorova, lokalni solver",
      summary:
        "Štapovi prenose samo aksijalne sile. Čvor C: ΣFy daje FBC; ΣFx daje FAC.",
      forces: [
        {
          id: "FBC",
          label: "FBC",
          direction: "uzduž BC",
          application: "štap BC",
          why: "Idealni štap — samo N (vlak ili tlak).",
        },
        {
          id: "FAC",
          label: "FAC",
          direction: "uzduž AC",
          application: "štap AC",
          why: "Idealni štap — samo N.",
        },
        {
          id: "FAB",
          label: "FAB",
          direction: "uzduž AB",
          application: "štap AB",
          why: "Idealni štap — samo N.",
        },
      ],
      equations: [
        `\\sum F_y^{(C)} = 0:\\quad F_{BC}\\sin ${ang}^\\circ - F = 0`,
        `\\sum F_x^{(C)} = 0:\\quad F_{AC} - F_{BC}\\cos ${ang}^\\circ = 0`,
      ],
      steps: [
        {
          title: "Čvor C",
          body: "Vertikalna komponenta štapa BC uravnotežuje F.",
          latex: [
            `F_{BC} = \\dfrac{${F}}{\\sin ${ang}^\\circ} = ${fmt(FBC)}\\ \\mathrm{kN}\\ (\\text{vlak})`,
            `F_{AC} = ${fmt(FAC)}\\ \\mathrm{kN}\\ (\\text{tlak})`,
          ],
        },
        {
          title: "Kontrola u B",
          body: "ΣFx, ΣFy u B potvrđuju FAB.",
          latex: [`F_{AB} = ${fmt(FAB)}\\ \\mathrm{kN}\\ (\\text{tlak})`],
        },
      ],
      results: [
        { symbol: "FBC", value: `${fmt(FBC)} kN (vlak)`, meaning: "štap BC" },
        { symbol: "FAC", value: `${fmt(FAC)} kN (tlak)`, meaning: "štap AC" },
        { symbol: "FAB", value: `${fmt(FAB)} kN (tlak)`, meaning: "štap AB" },
      ],
    },
    tags: ["generirano", "rešetka"],
  };
}

function generateCableVariant(difficulty: Difficulty, seed: number): MechTask {
  const F = 6 + (seed % 5) * 2;
  const ang = difficulty === "ispitni" ? 50 : 40;
  const S = round(F / Math.sin((ang * Math.PI) / 180), 2);
  const FAx = round(-S * Math.cos((ang * Math.PI) / 180), 2);

  return {
    id: `gen-m1-cable-${difficulty}-${seed}`,
    title: `Kabel + štap · F=${F} kN · gen #${seed}`,
    course: "mehanika1",
    mode: "2d",
    difficulty,
    statement:
      "Šipka AB zglobno u A, držana kabelom BC. Objasniti smjerove (kabel = vlak) i odrediti reakcije.",
    given: [`F = ${F} kN`, `kut kabla ${ang}°`, "AB = 3 m"],
    sketch: {
      viewBox: "0 0 640 360",
      elements: [
        {
          id: "rod",
          kind: "rod",
          points: [
            { x: 100, y: 280 },
            { x: 380, y: 280 },
          ],
          label: "štap AB",
        },
        {
          id: "cable",
          kind: "cable",
          points: [
            { x: 380, y: 280 },
            { x: 520, y: 100 },
          ],
          label: "kabel BC",
          dashed: true,
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 100, y: 280 }, label: "A" },
        { id: "C", kind: "hinge", at: { x: 520, y: 100 }, label: "C" },
      ],
      forces: [
        {
          id: "F",
          at: { x: 380, y: 280 },
          angleDeg: -90,
          magnitude: F,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [{ text: `${ang}°`, at: { x: 440, y: 220 }, kind: "dim" }],
    },
    solution: {
      styleNote: "FSB — kabel samo vlak; lokalni solver",
      summary:
        "Kabel vuče uzduž BC. ΣMA eliminira reakcije u A i daje S.",
      forces: [
        {
          id: "S",
          label: "S (kabel)",
          direction: `od B prema C (${ang}°)`,
          application: "kabel BC",
          why: "Kabel ne može tlačiti — sila je uvijek vlačna.",
        },
        {
          id: "N",
          label: "N (štap)",
          direction: "uzduž AB",
          application: "štap AB",
          why: "Štap: samo aksijalna sila (ovdje tipično tlak).",
        },
      ],
      equations: [
        `\\sum M_A = 0:\\quad S\\sin ${ang}^\\circ\\cdot 3 - F\\cdot 3 = 0`,
        `\\sum F_x = 0:\\quad F_{Ax} + S\\cos ${ang}^\\circ = 0`,
      ],
      steps: [
        {
          title: "Sila u kabelu",
          body: "Moment za A — štap prolazi kroz A pa nema momenta.",
          latex: [
            `S = \\dfrac{${F}}{\\sin ${ang}^\\circ} = ${fmt(S)}\\ \\mathrm{kN}\\ (\\text{vlak})`,
          ],
        },
        {
          title: "Reakcije u A",
          body: "ΣFx daje FAx; predznak tumači stvarni smjer.",
          latex: [
            `F_{Ax} = ${fmt(FAx)}\\ \\mathrm{kN}`,
            "F_{Ay} \\approx 0\\ \\text{(za ovu geometriju)}",
          ],
          note:
            FAx < 0
              ? "Negativan FAx → stvarni smjer ulijevo."
              : "Pozitivan FAx → pretpostavka (+x) točna.",
        },
      ],
      results: [
        { symbol: "S", value: `${fmt(S)} kN (vlak)`, meaning: "kabel" },
        {
          symbol: "FAx",
          value: `${fmt(FAx)} kN`,
          meaning: "reakcija zgloba A",
        },
      ],
    },
    tags: ["generirano", "kabel"],
  };
}

function generateCantileverVariant(difficulty: Difficulty, seed: number): MechTask {
  const L = difficulty === "lako" ? 2 : difficulty === "srednje" ? 3 : 4;
  const q = 2 + (seed % 5);
  const F = 5 + (seed % 6) * 2;
  const FA = round(q * L + F, 2);
  const MA = round((q * L * L) / 2 + F * L, 2);
  return {
    id: `gen-m1-cant-${difficulty}-${seed}`,
    title: `Konzola q=${q} F=${F} · gen #${seed}`,
    course: "mehanika1",
    mode: "2d",
    difficulty,
    statement:
      "Konzola uklještena u A s raspodjelom q i silom F na kraju. Odrediti FA i MA.",
    given: [`q = ${q} kN/m`, `F = ${F} kN`, `L = ${L} m`],
    sketch: {
      viewBox: "0 0 640 300",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 100, y: 150 },
            { x: 100 + L * 100, y: 150 },
          ],
        },
      ],
      supports: [{ id: "A", kind: "fixed", at: { x: 100, y: 150 }, label: "A" }],
      forces: [
        {
          id: "q",
          at: { x: 100, y: 150 },
          angleDeg: -90,
          magnitude: q,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: L * 100,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 100 + L * 100, y: 150 },
          angleDeg: -90,
          magnitude: F,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [{ text: `L=${L} m`, at: { x: 200, y: 200 }, kind: "dim" }],
    },
    solution: {
      summary: "Uklještenje: sila + moment.",
      forces: [
        {
          id: "FA",
          label: "FA",
          direction: "↑",
          application: "A",
          why: "Uklještenje prenosi silu.",
        },
        {
          id: "MA",
          label: "MA",
          direction: "ccw",
          application: "A",
          why: "Uklještenje prenosi moment.",
        },
      ],
      equations: [
        `F_A=qL+F=${fmt(FA)}\\ \\mathrm{kN}`,
        `M_A=qL^2/2+FL=${fmt(MA)}\\ \\mathrm{kNm}`,
      ],
      steps: [
        {
          title: "Reakcije uklještenja",
          body: "ΣFy i ΣMA.",
          latex: [
            `F_A=${fmt(FA)}\\ \\mathrm{kN}`,
            `M_A=${fmt(MA)}\\ \\mathrm{kNm}`,
          ],
        },
      ],
      results: [
        { symbol: "FA", value: `${fmt(FA)} kN`, meaning: "vertikalna" },
        { symbol: "MA", value: `${fmt(MA)} kNm`, meaning: "uklješteni moment" },
      ],
    },
    tags: ["generirano", "konzola"],
  };
}

function generateKinematicsVariant(difficulty: Difficulty, seed: number): MechTask {
  const R = round(0.1 + (seed % 4) * 0.05, 2);
  const omega = 6 + (seed % 5) * 2;
  const phi = difficulty === "lako" ? 30 : difficulty === "srednje" ? 40 : 55;
  const vA = round(omega * R, 3);
  const vB = round(vA * Math.cos((phi * Math.PI) / 180) / Math.max(Math.sin((phi * Math.PI) / 180), 0.2), 3);
  return {
    id: `gen-m2-kin-${difficulty}-${seed}`,
    title: `Kinematika ω=${omega} · gen #${seed}`,
    course: "mehanika2",
    mode: "2d",
    difficulty,
    statement:
      "Kotač R kotrlja se bez proklizavanja s kutnom brzinom ω. Odrediti vA i vB za kut φ (relativna kinematika štapa).",
    given: [`R = ${R} m`, `ω = ${omega} rad/s`, `φ = ${phi}°`],
    sketch: {
      viewBox: "0 0 680 340",
      elements: [
        {
          id: "ground",
          kind: "beam",
          points: [
            { x: 40, y: 280 },
            { x: 640, y: 280 },
          ],
          dashed: true,
        },
        {
          id: "rod",
          kind: "rod",
          points: [
            { x: 220, y: 200 },
            { x: 480, y: 160 },
          ],
          label: "AB",
        },
      ],
      supports: [
        { id: "A", kind: "hinge", at: { x: 220, y: 200 }, label: "A" },
        {
          id: "B",
          kind: "roller",
          at: { x: 480, y: 160 },
          label: "B",
          orientationDeg: 90,
        },
      ],
      forces: [
        {
          id: "w",
          at: { x: 180, y: 220 },
          angleDeg: 0,
          magnitude: omega,
          unit: "rad/s",
          label: "ω",
          kind: "moment",
          sense: "ccw",
          color: "#38bdf8",
        },
      ],
      labels: [
        { text: `φ=${phi}°`, at: { x: 260, y: 230 }, kind: "dim" },
        { text: `R=${R}`, at: { x: 160, y: 260 }, kind: "dim" },
      ],
    },
    solution: {
      summary: "vA = ωR (kotrljanje). vB iz vB = vA + ωAB × rB/A.",
      forces: [
        {
          id: "v",
          label: "vA, vB",
          direction: "vB uz vodilicu",
          application: "A, B",
          why: "Kinematika — brzine, ne sile.",
        },
      ],
      equations: [
        `v_A=\\omega R=${fmt(vA)}\\ \\mathrm{m/s}`,
        `v_B\\approx ${fmt(vB)}\\ \\mathrm{m/s}`,
      ],
      steps: [
        {
          title: "Brzina središta",
          body: "Bez proklizavanja.",
          latex: [`v_A=${fmt(vA)}\\ \\mathrm{m/s}`],
        },
        {
          title: "Relativna brzina",
          body: "Projekcije za zadani φ.",
          latex: [`v_B\\approx ${fmt(vB)}\\ \\mathrm{m/s}`],
        },
      ],
      results: [
        { symbol: "vA", value: `${fmt(vA)} m/s`, meaning: "središte kotača" },
        { symbol: "vB", value: `${fmt(vB)} m/s`, meaning: "blok/klip" },
      ],
    },
    tags: ["generirano", "kinematika"],
  };
}

function generateMeh2Variant(
  base: MechTask,
  difficulty: Difficulty,
  seed: number,
): MechTask {
  const m = 5 + (seed % 5) * 5;
  const alpha = difficulty === "lako" ? 20 : difficulty === "srednje" ? 30 : 40;
  const mu = difficulty === "ispitni" ? 0.35 : 0.2;
  const P = 40 + (seed % 4) * 20;
  const g = 9.81;
  const N = round(m * g * Math.cos((alpha * Math.PI) / 180), 2);
  const T = round(mu * N, 2);
  const Gsin = round(m * g * Math.sin((alpha * Math.PI) / 180), 2);
  const a = round((P - Gsin - T) / m, 3);

  return cloneTask(base, {
    id: `gen-m2-${difficulty}-${seed}`,
    title: `Dinamika na kosini — ${labelDiff(difficulty)}`,
    course: "mehanika2",
    difficulty,
    mode: "2d",
    statement:
      "Blok mase m na hrapavoj kosini vuče se silom P. Odrediti ubrzanje (Newton II).",
    given: [
      `m = ${m} kg`,
      `α = ${alpha}°`,
      `μ = ${mu}`,
      `P = ${P} N`,
      `g = ${g} m/s²`,
    ],
    sketch: {
      ...base.sketch,
      forces: [
        {
          id: "P",
          at: { x: 320, y: 190 },
          angleDeg: -alpha + 2,
          magnitude: P,
          unit: "N",
          label: "P",
          color: "#22c55e",
        },
        {
          id: "G",
          at: { x: 300, y: 210 },
          angleDeg: -90,
          magnitude: round(m * g, 1),
          unit: "N",
          label: "G",
          color: "#ef4444",
        },
        {
          id: "N",
          at: { x: 290, y: 230 },
          angleDeg: 90 - alpha,
          magnitude: N,
          unit: "N",
          label: "N",
          color: "#38bdf8",
        },
        {
          id: "T",
          at: { x: 270, y: 220 },
          angleDeg: 180 - alpha,
          magnitude: T,
          unit: "N",
          label: "T=μN",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: `α = ${alpha}°`, at: { x: 140, y: 300 }, kind: "dim" },
        { text: `μ = ${mu}`, at: { x: 400, y: 280 }, kind: "note" },
      ],
    },
    solution: {
      summary: "ΣFn = 0 → N; ΣFt = ma → a. Predznak a tumači smjer.",
      forces: [
        {
          id: "P",
          label: "P",
          direction: "uzbrdo",
          application: "blok",
          why: "Zadana vučna sila.",
        },
        {
          id: "T",
          label: "T",
          direction: "nizbrdo",
          application: "dodir",
          why: "Trenje se opire pretpostavljenom klizanju uzbrdo.",
        },
      ],
      equations: [
        `N = mg\\cos ${alpha}^\\circ = ${fmt(N)}\\ \\mathrm{N}`,
        `a = \\dfrac{P - mg\\sin ${alpha}^\\circ - \\mu N}{m} = ${fmt(a)}\\ \\mathrm{m/s^2}`,
      ],
      steps: [
        {
          title: "Normalna reakcija i trenje",
          body: "Nema ubrzanja okomito na kosinu.",
          latex: [
            `N = ${fmt(N)}\\ \\mathrm{N}`,
            `T = \\mu N = ${fmt(T)}\\ \\mathrm{N}`,
          ],
        },
        {
          title: "Newton II uzduž kosine",
          body: "Pozitivan smjer uzbrdo.",
          latex: [`a = ${fmt(a)}\\ \\mathrm{m/s^2}`],
          note:
            a < 0
              ? "Negativan a → ubrzanje je nizbrdo."
              : "Pozitivan a → blok ubrzava uzbrdo.",
        },
      ],
      results: [
        { symbol: "N", value: `${fmt(N)} N`, meaning: "normalna reakcija" },
        { symbol: "T", value: `${fmt(T)} N`, meaning: "trenje" },
        {
          symbol: "a",
          value: `${fmt(a)} m/s²`,
          meaning: a < 0 ? "nizbrdo" : "uzbrdo",
        },
      ],
    },
  });
}

function generateMdtVariant(
  base: MechTask,
  difficulty: Difficulty,
  seed: number,
): MechTask {
  const a = 1;
  const q = 1 + (seed % 4);
  const F = round((difficulty === "lako" ? 2 : 3) * q * a, 2);
  const L = 4 * a;
  const M0 = difficulty === "ispitni" ? round(2 * q * a * a, 2) : 0;
  const FB = round((q * 2 * a * a + F * 3 * a - M0) / (4 * a), 3);
  const FA = round(q * 2 * a + F - FB, 3);

  const stations = [
    { x: 0, N: 0, T: FA, M: 0 },
    { x: 2, N: 0, T: round(FA - q * 2, 3), M: round(FA * 2 - q * 2, 3) },
    { x: 3, N: 0, T: round(FA - q * 2, 3), M: round(FA * 3 - q * 2 * 2.5, 3) },
    {
      x: 3.01,
      N: 0,
      T: round(FA - q * 2 - F, 3),
      M: round(FA * 3 - q * 2 * 2.5, 3),
    },
    { x: 4, N: 0, T: round(FA - q * 2 - F, 3), M: 0 },
  ];

  return {
    id: `gen-mdt-${difficulty}-${seed}`,
    title: `Dijagrami N, T, M — ${labelDiff(difficulty)}`,
    course: "mdt",
    mode: "2d",
    difficulty,
    statement:
      "Odrediti reakcije te skicirati dijagrame unutarnjih sila N, T i M za nosač prema slici.",
    given: [
      `q = ${q} kN/m`,
      `F = ${F} kN`,
      M0 ? `M = ${M0} kNm` : "bez koncentriranog momenta",
      `L = ${L} m`,
    ],
    sketch: {
      viewBox: "0 0 720 480",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 80, y: 120 },
            { x: 640, y: 120 },
          ],
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 80, y: 120 }, label: "A" },
        { id: "B", kind: "roller", at: { x: 640, y: 120 }, label: "B" },
      ],
      forces: [
        {
          id: "q",
          at: { x: 80, y: 120 },
          angleDeg: -90,
          magnitude: q,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: 280,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 440, y: 120 },
          angleDeg: -90,
          magnitude: F,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
        ...(M0
          ? [
              {
                id: "M0",
                at: { x: 560, y: 120 },
                angleDeg: 0,
                magnitude: M0,
                unit: "kNm",
                label: "M",
                kind: "moment" as const,
                sense: "cw" as const,
                color: "#f59e0b",
              },
            ]
          : []),
      ],
      labels: [
        { text: "2a", at: { x: 200, y: 150 }, kind: "dim" },
        { text: "a", at: { x: 400, y: 150 }, kind: "dim" },
        { text: "a", at: { x: 520, y: 150 }, kind: "dim" },
      ],
      diagrams: {
        maxT: Math.max(Math.abs(FA), Math.abs(FB), F) + 1,
        maxM: Math.max(...stations.map((s) => Math.abs(s.M ?? 0)), 1),
        stations,
      },
    },
    solution: {
      styleNote: "MDT — N, T, M dijagrami",
      summary:
        "Reakcije iz ΣFy i ΣMA. N≈0. T i M po segmentima; skokovi ispod F i M.",
      forces: [
        {
          id: "FA",
          label: "FA",
          direction: "↑",
          application: "A",
          why: "Zglob.",
        },
        {
          id: "FB",
          label: "FB",
          direction: "↑",
          application: "B",
          why: "Pokretni oslonac.",
        },
      ],
      equations: [
        `F_A = ${fmt(FA)}\\ \\mathrm{kN}`,
        `F_B = ${fmt(FB)}\\ \\mathrm{kN}`,
      ],
      steps: [
        {
          title: "Reakcije",
          body: "ΣMA = 0 i ΣFy = 0.",
          latex: [
            `F_B = ${fmt(FB)}\\ \\mathrm{kN}`,
            `F_A = ${fmt(FA)}\\ \\mathrm{kN}`,
          ],
        },
        {
          title: "Dijagrami",
          body: "T(x) počinje s FA; linearno opada ispod q; skok −F. M(0)=M(L)=0.",
          latex: ["N(x)\\approx 0", "T(0^+)=F_A", "M_{\\max}\\ \\text{u blizini } x=2a"],
        },
      ],
      results: [
        { symbol: "FA", value: `${fmt(FA)} kN`, meaning: "reakcija A" },
        { symbol: "FB", value: `${fmt(FB)} kN`, meaning: "reakcija B" },
      ],
    },
    tags: ["generirano", "MDT"],
  };
}

export function listCatalog() {
  return BUILTIN_TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    course: t.course,
    difficulty: t.difficulty,
    mode: t.mode,
  }));
}
