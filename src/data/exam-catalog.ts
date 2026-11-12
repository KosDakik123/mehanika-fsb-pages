import type { MechTask } from "@/lib/types";

/**
 * Extra catalog drawn from FSB Mehanika I ispit 16.9.2022. rješenja
 * and typical Saucha-style exercise patterns (local solutions, no AI).
 */
export const EXAM_CATALOG: MechTask[] = [
  {
    id: "m1-ispit-okvir-3d",
    title: "Ispit — okvir ABCD uklješten u A (3D)",
    course: "mehanika1",
    mode: "3d",
    difficulty: "ispitni",
    statement:
      "Okvir ABCD zanemarive težine uklješten je u točki A te opterećen silama i momentima prema slici. Osloboditi okvir veza s okolinom te izračunati iznose pojedinih sila (Meh. I ispit 16.9.2022., 1. zadatak).",
    given: [
      "F1 = 100 N",
      "F2 = 70 N",
      "F3 = 80 N",
      "M1 = 50 Nm",
      "M2 = 30 Nm",
      "a = 4 m, b = 3 m, c = 2 m, ℓ = 1 m",
    ],
    sketch: {
      viewBox: "0 0 720 440",
      elements: [
        {
          id: "AB",
          kind: "frame",
          points: [
            { x: 160, y: 320 },
            { x: 400, y: 240 },
          ],
          label: "AB",
        },
        {
          id: "BC",
          kind: "frame",
          points: [
            { x: 400, y: 240 },
            { x: 520, y: 120 },
          ],
          label: "BC",
        },
        {
          id: "CD",
          kind: "frame",
          points: [
            { x: 520, y: 120 },
            { x: 280, y: 160 },
          ],
          label: "CD",
        },
        {
          id: "DA",
          kind: "frame",
          points: [
            { x: 280, y: 160 },
            { x: 160, y: 320 },
          ],
          label: "DA",
        },
      ],
      supports: [
        { id: "A", kind: "fixed", at: { x: 160, y: 320 }, label: "A" },
      ],
      forces: [
        {
          id: "F1",
          at: { x: 400, y: 240 },
          angleDeg: -90,
          magnitude: 100,
          unit: "N",
          label: "F1",
          color: "#ef4444",
        },
        {
          id: "F2",
          at: { x: 520, y: 120 },
          angleDeg: 180,
          magnitude: 70,
          unit: "N",
          label: "F2",
          color: "#22c55e",
        },
        {
          id: "F3",
          at: { x: 280, y: 160 },
          angleDeg: -35,
          magnitude: 80,
          unit: "N",
          label: "F3",
          color: "#a855f7",
        },
        {
          id: "M1",
          at: { x: 240, y: 260 },
          angleDeg: 0,
          magnitude: 50,
          unit: "Nm",
          label: "M1",
          kind: "moment",
          sense: "ccw",
          color: "#f59e0b",
        },
        {
          id: "M2",
          at: { x: 460, y: 180 },
          angleDeg: 0,
          magnitude: 30,
          unit: "Nm",
          label: "M2",
          kind: "moment",
          sense: "cw",
          color: "#fb923c",
        },
      ],
      labels: [
        { text: "x", at: { x: 580, y: 340 }, kind: "note" },
        { text: "y", at: { x: 140, y: 80 }, kind: "note" },
        { text: "z", at: { x: 80, y: 300 }, kind: "note" },
        { text: "a,b,c,ℓ", at: { x: 360, y: 380 }, kind: "dim" },
      ],
    },
    solution: {
      styleNote: "Meh_I ispit 16.9.2022. — 1. zadatak",
      summary:
        "Uklještenje u A daje FAx, FAy, FAz, MAx, MAy, MAz. F3 se razlaže kosinusima smjera s D = √(a²+b²+c²) = √29.",
      forces: [
        {
          id: "reak",
          label: "FAx…MAz",
          direction: "po osima x,y,z",
          application: "uklještenje A",
          why: "Uklještenje sprječava 3 pomaka + 3 rotacije → 6 reakcija.",
        },
        {
          id: "F3",
          label: "F3",
          direction: "kosa u prostoru",
          application: "točka D",
          why: "Fx=F3·c/D, Fy=F3·a/D, Fz=F3·b/D.",
          components: "F3x, F3y, F3z",
        },
      ],
      equations: [
        "D=\\sqrt{a^2+b^2+c^2}=\\sqrt{29}",
        "\\sum F_x=0,\\ \\sum F_y=0,\\ \\sum F_z=0",
        "\\sum M_x=0,\\ \\sum M_y=0,\\ \\sum M_z=0",
      ],
      steps: [
        {
          title: "1. Kosinusi smjera F3",
          body: "D = √29 m.",
          latex: [
            "F_{3x}=80\\cdot 2/\\sqrt{29}",
            "F_{3y}=80\\cdot 4/\\sqrt{29}",
            "F_{3z}=80\\cdot 3/\\sqrt{29}",
          ],
        },
        {
          title: "2. ΣF = 0",
          body: "Tri skalarne jednadžbe → reakcije sila.",
          latex: [
            "F_{Ax}=40{,}289\\ \\mathrm{N}",
            "F_{Ay}=59{,}423\\ \\mathrm{N}",
            "F_{Az}=55{,}433\\ \\mathrm{N}",
          ],
        },
        {
          title: "3. ΣM = 0",
          body: "Momenti sila za A + M1, M2.",
          latex: [
            "M_{Ax}=0",
            "M_{Ay}=71{,}732\\ \\mathrm{Nm}",
            "M_{Az}=197{,}690\\ \\mathrm{Nm}",
          ],
          note: "MAx = 0 znači da se projekcije momenata oko x-osi poništavaju.",
        },
      ],
      results: [
        { symbol: "FAx", value: "40,289 N", meaning: "uklještenje A" },
        { symbol: "FAy", value: "59,423 N", meaning: "uklještenje A" },
        { symbol: "FAz", value: "55,433 N", meaning: "uklještenje A" },
        { symbol: "MAy", value: "71,732 Nm", meaning: "moment uklještenja" },
        { symbol: "MAz", value: "197,690 Nm", meaning: "moment uklještenja" },
      ],
    },
    tags: ["ispit", "3d", "okvir", "uklještenje", "2022-09"],
  },
  {
    id: "m1-ispit-trenje-bubanj",
    title: "Ispit — blokovi G1, G2 i teret Q (trenje)",
    course: "mehanika1",
    mode: "2d",
    difficulty: "ispitni",
    statement:
      "Sustav blokova G1 i G2 povezanih s bubnjem 1; teret Q preko nepomičnog valjka 2. Odrediti maksimalni Q za ravnotežu (Meh. I ispit 16.9.2022., 2. zadatak).",
    given: [
      "G1 = 100 N",
      "G2 = 60 N",
      "μ1 = 0,3",
      "μ2 = 0,2",
      "d1 = 0,6 m",
      "r2 = 0,4 m",
      "r3 = 0,7 m",
    ],
    sketch: {
      viewBox: "0 0 700 400",
      elements: [
        {
          id: "incline1",
          kind: "beam",
          points: [
            { x: 60, y: 120 },
            { x: 260, y: 280 },
          ],
        },
        {
          id: "incline2",
          kind: "beam",
          points: [
            { x: 440, y: 280 },
            { x: 640, y: 140 },
          ],
        },
        {
          id: "cable1",
          kind: "cable",
          points: [
            { x: 180, y: 200 },
            { x: 320, y: 220 },
          ],
          dashed: true,
        },
        {
          id: "cable2",
          kind: "cable",
          points: [
            { x: 380, y: 220 },
            { x: 520, y: 200 },
          ],
          dashed: true,
        },
        {
          id: "cableQ",
          kind: "cable",
          points: [
            { x: 350, y: 260 },
            { x: 350, y: 340 },
          ],
          dashed: true,
          label: "Q",
        },
      ],
      supports: [
        { id: "drum", kind: "hinge", at: { x: 350, y: 220 }, label: "1" },
        { id: "pulley", kind: "hinge", at: { x: 350, y: 300 }, label: "2" },
      ],
      forces: [
        {
          id: "G1",
          at: { x: 160, y: 200 },
          angleDeg: -90,
          magnitude: 100,
          unit: "N",
          label: "G1",
          color: "#ef4444",
        },
        {
          id: "G2",
          at: { x: 540, y: 200 },
          angleDeg: -90,
          magnitude: 60,
          unit: "N",
          label: "G2",
          color: "#ef4444",
        },
        {
          id: "Q",
          at: { x: 350, y: 350 },
          angleDeg: -90,
          magnitude: 15,
          unit: "N",
          label: "Q",
          color: "#22c55e",
        },
      ],
      labels: [
        { text: "45°", at: { x: 100, y: 260 }, kind: "dim" },
        { text: "60°", at: { x: 580, y: 260 }, kind: "dim" },
        { text: "μ1, μ2", at: { x: 300, y: 100 }, kind: "note" },
      ],
    },
    solution: {
      styleNote: "Meh_I ispit 16.9.2022. — 2. zadatak",
      summary:
        "FBD svakog bloka: N i Fs=μN. Moment za bubanj povezuje Fs1, Fs2, Fs3. Valjak 2: Q = Fs3·e^{μα}.",
      forces: [
        {
          id: "Fs1",
          label: "Fs1",
          direction: "uz kosinu (trenje)",
          application: "G1",
          why: "Trenje klizanja μ1N1; smjer sprječava klizanje niz kosinu.",
        },
        {
          id: "Fs2",
          label: "Fs2",
          direction: "uz kosinu",
          application: "G2",
          why: "Analogno za G2 na 60°.",
        },
        {
          id: "Q",
          label: "Q",
          direction: "dolje",
          application: "teret",
          why: "Maksimalni Q za limitu ravnoteže preko valjka s μ2.",
        },
      ],
      equations: [
        "\\sum F_x^{(1)}=0:\\ Fs1 + \\mu_1 N_1\\text{-komponente s }G_1",
        "Fs1\\,r_2 + Fs2\\,r_3 - Fs3\\,r_{\\mathrm{eff}} = 0",
        "Q = Fs3\\, e^{\\mu_2\\alpha}",
      ],
      steps: [
        {
          title: "Blok G1 (45°)",
          body: "ΣFx, ΣFy na kosini → N1, Fs1.",
          latex: [
            "N_1 = G_1\\cos 45^\\circ = 70{,}71\\ \\mathrm{N}",
            "Fs1 = 42{,}962\\ \\mathrm{N}",
          ],
        },
        {
          title: "Blok G2 (60°)",
          body: "Isto za G2.",
          latex: [
            "N_2 = 30\\ \\mathrm{N}",
            "Fs2 = 20{,}326\\ \\mathrm{N}",
          ],
        },
        {
          title: "Bubanj + valjak → Q",
          body: "Momentna veza i Eulerova formula za trenje užeta.",
          latex: [
            "Fs3 = 14{,}85\\ \\mathrm{N}",
            "Q_{\\max} \\approx 14{,}85\\ \\mathrm{N}\\ \\text{(ograničeno Fs1)}",
          ],
          note: "U rješenju ispita Q je vezan uz Fs1 kao kritični član.",
        },
      ],
      results: [
        { symbol: "N1", value: "70,71 N", meaning: "normala G1" },
        { symbol: "Fs1", value: "42,96 N", meaning: "trenje G1" },
        { symbol: "N2", value: "30 N", meaning: "normala G2" },
        { symbol: "Fs2", value: "20,33 N", meaning: "trenje G2" },
        { symbol: "Qmax", value: "≈ 14,85 N", meaning: "maks. teret" },
      ],
    },
    tags: ["ispit", "trenje", "bubanj", "valjak", "2022-09"],
  },
  {
    id: "m1-ispit-nosač-ntm",
    title: "Ispit — nosač s q, F, M (dijagrami N,T,M)",
    course: "mdt",
    mode: "2d",
    difficulty: "ispitni",
    statement:
      "Za nosač zadan i opterećen prema slici skicirati i kotirati dijagrame unutarnjih sila i momenata (Meh. I ispit 16.9.2022., 3. zadatak). F = 2qa, M = 3qa², duljine 3a|2a|2a|a.",
    given: ["F = 2qa", "M = 3qa²", "segmenti: 3a, 2a, 2a, a", "a, q zadani simbolički"],
    sketch: {
      viewBox: "0 0 740 500",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 70, y: 110 },
            { x: 670, y: 110 },
          ],
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 70, y: 110 }, label: "A" },
        { id: "D", kind: "roller", at: { x: 520, y: 110 }, label: "D" },
      ],
      forces: [
        {
          id: "q",
          at: { x: 70, y: 110 },
          angleDeg: -90,
          magnitude: 1,
          unit: "qa",
          label: "q",
          kind: "distributed",
          length: 225,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 370, y: 110 },
          angleDeg: -90,
          magnitude: 2,
          unit: "qa",
          label: "F=2qa",
          color: "#ef4444",
        },
        {
          id: "M",
          at: { x: 595, y: 110 },
          angleDeg: 0,
          magnitude: 3,
          unit: "qa²",
          label: "M=3qa²",
          kind: "moment",
          sense: "cw",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "3a", at: { x: 170, y: 145 }, kind: "dim" },
        { text: "2a", at: { x: 320, y: 145 }, kind: "dim" },
        { text: "2a", at: { x: 470, y: 145 }, kind: "dim" },
        { text: "a", at: { x: 610, y: 145 }, kind: "dim" },
        { text: "B", at: { x: 290, y: 95 }, kind: "point" },
        { text: "C", at: { x: 370, y: 95 }, kind: "point" },
        { text: "E", at: { x: 670, y: 95 }, kind: "point" },
      ],
      diagrams: {
        maxN: 1,
        maxT: 5,
        maxM: 5,
        stations: [
          { x: 0, N: 0, T: 1 / 7, M: 0 },
          { x: 3, N: 0, T: 1 / 7 - 3, M: -3 / 7 },
          { x: 5, N: 0, T: 1 / 7 - 3, M: -17 / 7 },
          { x: 5.01, N: 0, T: 1 / 7 - 5, M: -17 / 7 },
          { x: 7, N: 0, T: 1 / 7 - 5, M: -239 / 98 },
          { x: 7.01, N: 0, T: 1 / 7 - 5, M: -239 / 98 + 3 },
          { x: 8, N: 0, T: -34 / 7 + 1 / 7, M: 0 },
        ],
      },
    },
    solution: {
      styleNote: "Meh_I ispit 16.9.2022. — 3. zadatak (NTM)",
      summary:
        "Reakcije: FAx=0, FA=(1/7)qa, FD=(34/7)qa. Zatim Nx≈0, Qz i My po segmentima s kotama u jedinicama [qa] i [qa²].",
      forces: [
        {
          id: "FA",
          label: "FA",
          direction: "↑",
          application: "A",
          why: "Zglob — vertikalna reakcija.",
        },
        {
          id: "FD",
          label: "FD",
          direction: "↑",
          application: "D",
          why: "Pokretni oslonac.",
        },
      ],
      equations: [
        "\\sum F_x=0:\\ F_{Ax}=0",
        "\\sum F_y=0:\\ F_A+F_D-q\\cdot 3a-F=0",
        "\\sum M_A=0:\\ F_D\\cdot 7a - q\\cdot 3a\\cdot 1{,}5a - F\\cdot 5a + M = 0",
      ],
      steps: [
        {
          title: "Reakcije (ispit)",
          body: "Iz ΣMA i ΣFy.",
          latex: [
            "F_A = \\tfrac{1}{7}qa",
            "F_D = \\tfrac{34}{7}qa",
            "F_{Ax}=0",
          ],
        },
        {
          title: "Dijagrami",
          body: "Skokovi ispod F i M; kotati ekstremne vrijednosti (−3, −17/7, −239/98, …) u [qa] / [qa²].",
          latex: [
            "N_x \\approx 0",
            "Q_z,\\ M_y\\ \\text{prema ispitnoj skici}",
          ],
          note: "Pozitivan M rasteže donja vlakna (FSB/MDT).",
        },
      ],
      results: [
        { symbol: "FA", value: "(1/7)qa", meaning: "reakcija A" },
        { symbol: "FD", value: "(34/7)qa", meaning: "reakcija D" },
        { symbol: "FAx", value: "0", meaning: "nema Fx" },
      ],
    },
    tags: ["ispit", "nosač", "NTM", "MDT", "2022-09"],
  },
  {
    id: "m1-ispit-okvirni-nosac",
    title: "Ispit — okvirni nosač A–E (reakcije + NTM)",
    course: "mdt",
    mode: "2d",
    difficulty: "ispitni",
    statement:
      "Za okvirni nosač odrediti reakcije u A i D te skicirati dijagrame unutarnjih sila (Meh. I ispit 16.9.2022., 4. zadatak). F = ql, q, l zadani.",
    given: ["q, l", "F = ql"],
    sketch: {
      viewBox: "0 0 700 480",
      elements: [
        {
          id: "AB",
          kind: "frame",
          points: [
            { x: 120, y: 280 },
            { x: 120, y: 120 },
          ],
          label: "AB",
        },
        {
          id: "BC",
          kind: "frame",
          points: [
            { x: 120, y: 120 },
            { x: 360, y: 120 },
          ],
          label: "BC",
        },
        {
          id: "CD",
          kind: "frame",
          points: [
            { x: 360, y: 120 },
            { x: 360, y: 280 },
          ],
          label: "CD",
        },
        {
          id: "DE",
          kind: "frame",
          points: [
            { x: 360, y: 280 },
            { x: 560, y: 280 },
          ],
          label: "DE",
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 120, y: 280 }, label: "A" },
        { id: "D", kind: "roller", at: { x: 360, y: 280 }, label: "D" },
      ],
      forces: [
        {
          id: "q",
          at: { x: 120, y: 120 },
          angleDeg: -90,
          magnitude: 1,
          unit: "q",
          label: "q",
          kind: "distributed",
          length: 240,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 560, y: 280 },
          angleDeg: -90,
          magnitude: 1,
          unit: "ql",
          label: "F=ql",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "l", at: { x: 90, y: 200 }, kind: "dim" },
        { text: "2l", at: { x: 240, y: 100 }, kind: "dim" },
        { text: "l", at: { x: 380, y: 200 }, kind: "dim" },
        { text: "l", at: { x: 460, y: 300 }, kind: "dim" },
        { text: "C", at: { x: 370, y: 105 }, kind: "point" },
        { text: "E", at: { x: 570, y: 270 }, kind: "point" },
      ],
      diagrams: {
        maxN: 2,
        maxT: 2,
        maxM: 2,
        stations: [
          { x: 0, N: 0, T: 0.75, M: 0 },
          { x: 1, N: 0, T: 0.75, M: 0.75 },
          { x: 2, N: 0, T: -0.25, M: 0.5 },
          { x: 3, N: 0, T: -0.25, M: 0 },
          { x: 4, N: 0, T: -1, M: -0.5 },
          { x: 5, N: 0, T: -1, M: 0 },
        ],
      },
    },
    solution: {
      styleNote: "Meh_I ispit 16.9.2022. — 4. zadatak",
      summary:
        "ΣFx: FAh = F = ql (smjer prema unutra/van ovisno o FBD). ΣFy i ΣMA daju FAv = (3/4)ql, FD = (7/4)ql prema ispitnom rješenju (predznaci u FBD).",
      forces: [
        {
          id: "FAh",
          label: "FAh",
          direction: "horizontalno",
          application: "A",
          why: "Zglob prenosi Fx.",
        },
        {
          id: "FAv",
          label: "FAv",
          direction: "vertikalno",
          application: "A",
          why: "Zglob prenosi Fy.",
        },
        {
          id: "FD",
          label: "FD",
          direction: "vertikalno",
          application: "D",
          why: "Pokretni oslonac.",
        },
      ],
      equations: [
        "\\sum F_x=0:\\ F_{Ah}-F=0",
        "\\sum F_y=0:\\ F_{Av}+F_D-q\\cdot 2l=0",
        "\\sum M_A=0:\\ F_D\\cdot 2l - q\\cdot 2l\\cdot l - F\\cdot l = 0",
      ],
      steps: [
        {
          title: "Reakcije (ispitne vrijednosti)",
          body: "Nakon konzistentnog FBD:",
          latex: [
            "F_{Ah}=ql",
            "F_{Av}=\\tfrac{3}{4}ql",
            "F_D=\\tfrac{7}{4}ql",
          ],
        },
        {
          title: "NTM po segmentima",
          body: "Nx, Qz, My s kotama ±ql, ±ql², ±0,5ql² prema ispitnoj skici.",
          latex: ["N_x,\\ Q_z,\\ M_y\\ \\text{kotirati na svakom stubu/gredu}"],
        },
      ],
      results: [
        { symbol: "FAh", value: "ql", meaning: "horizontalna u A" },
        { symbol: "FAv", value: "(3/4)ql", meaning: "vertikalna u A" },
        { symbol: "FD", value: "(7/4)ql", meaning: "reakcija D" },
      ],
    },
    tags: ["ispit", "okvir", "NTM", "2022-09"],
  },
  {
    id: "m1-greda-konzola-vise",
    title: "Konzola s q i F na kraju",
    course: "mehanika1",
    mode: "2d",
    difficulty: "lako",
    statement:
      "Konzola duljine L uklještena u A, raspodijeljeno q cijelom duljinom i sila F na slobodnom kraju. Odrediti reakcije uklještenja.",
    given: ["q = 4 kN/m", "F = 8 kN", "L = 3 m"],
    sketch: {
      viewBox: "0 0 640 320",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 100, y: 150 },
            { x: 520, y: 150 },
          ],
        },
      ],
      supports: [
        { id: "A", kind: "fixed", at: { x: 100, y: 150 }, label: "A" },
      ],
      forces: [
        {
          id: "q",
          at: { x: 100, y: 150 },
          angleDeg: -90,
          magnitude: 4,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: 420,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 520, y: 150 },
          angleDeg: -90,
          magnitude: 8,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [{ text: "L = 3 m", at: { x: 300, y: 200 }, kind: "dim" }],
    },
    solution: {
      summary:
        "Uklještenje: FA = qL+F (↑), MA = qL²/2 + F·L. Predznaci prema pretpostavljenom smjeru.",
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
          direction: "ccw (za opterećenje dolje)",
          application: "A",
          why: "Uklještenje prenosi moment.",
        },
      ],
      equations: [
        "\\sum F_y=0:\\ F_A - qL - F = 0",
        "\\sum M_A=0:\\ M_A - qL^2/2 - F L = 0",
      ],
      steps: [
        {
          title: "Reakcije",
          body: "Q = qL = 12 kN u težištu na L/2.",
          latex: [
            "F_A = 12 + 8 = 20\\ \\mathrm{kN}",
            "M_A = 4\\cdot 9/2 + 8\\cdot 3 = 42\\ \\mathrm{kNm}",
          ],
        },
      ],
      results: [
        { symbol: "FA", value: "20 kN ↑", meaning: "vertikalna reakcija" },
        { symbol: "MA", value: "42 kNm", meaning: "uklješteni moment" },
      ],
    },
    tags: ["konzola", "uklještenje", "greda"],
  },
  {
    id: "m1-resetka-warren",
    title: "Rešetka — jednostavni Warren (5 štapova)",
    course: "mehanika1",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Ravninska rešetka A–B–C–D s vertikalnim opterećenjem u C. Odrediti reakcije i sile u štapovima metodom čvorova.",
    given: ["F = 24 kN u C", "svi kutovi 60°", "duljina panela a = 2 m"],
    sketch: {
      viewBox: "0 0 700 360",
      elements: [
        {
          id: "AB",
          kind: "truss",
          points: [
            { x: 80, y: 280 },
            { x: 240, y: 280 },
          ],
          label: "AB",
        },
        {
          id: "BC",
          kind: "truss",
          points: [
            { x: 240, y: 280 },
            { x: 400, y: 280 },
          ],
          label: "BC",
        },
        {
          id: "CD",
          kind: "truss",
          points: [
            { x: 400, y: 280 },
            { x: 560, y: 280 },
          ],
          label: "CD",
        },
        {
          id: "AE",
          kind: "truss",
          points: [
            { x: 80, y: 280 },
            { x: 240, y: 140 },
          ],
          label: "AE",
        },
        {
          id: "EB",
          kind: "truss",
          points: [
            { x: 240, y: 140 },
            { x: 240, y: 280 },
          ],
          label: "EB",
        },
        {
          id: "EC",
          kind: "truss",
          points: [
            { x: 240, y: 140 },
            { x: 400, y: 280 },
          ],
          label: "EC",
        },
        {
          id: "CF",
          kind: "truss",
          points: [
            { x: 400, y: 280 },
            { x: 560, y: 140 },
          ],
          label: "CF",
        },
        {
          id: "FD",
          kind: "truss",
          points: [
            { x: 560, y: 140 },
            { x: 560, y: 280 },
          ],
          label: "FD",
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 80, y: 280 }, label: "A" },
        { id: "D", kind: "roller", at: { x: 560, y: 280 }, label: "D" },
      ],
      forces: [
        {
          id: "F",
          at: { x: 400, y: 280 },
          angleDeg: -90,
          magnitude: 24,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "E", at: { x: 240, y: 120 }, kind: "point" },
        { text: "F", at: { x: 560, y: 120 }, kind: "point" },
        { text: "60°", at: { x: 140, y: 220 }, kind: "dim" },
      ],
    },
    solution: {
      summary:
        "ΣMA → FD; ΣFy → FA. Metoda čvorova redom A, E, B, C… Štap pod vlakom pozitivan u FSB vježbama.",
      forces: [
        {
          id: "FA",
          label: "FA",
          direction: "↑",
          application: "A",
          why: "Zglob.",
        },
        {
          id: "FD",
          label: "FD",
          direction: "↑",
          application: "D",
          why: "Pokretni oslonac.",
        },
      ],
      equations: [
        "\\sum M_A=0:\\ F_D\\cdot 3a - F\\cdot 2a = 0",
        "\\sum F_y=0:\\ F_A+F_D-F=0",
      ],
      steps: [
        {
          title: "Reakcije",
          body: "a = 2 m → raspon 6 m; F u C na 4 m od A.",
          latex: [
            "F_D = 16\\ \\mathrm{kN}",
            "F_A = 8\\ \\mathrm{kN}",
          ],
        },
        {
          title: "Čvorovi",
          body: "Iz A: FAE i FAB; nastaviti do C.",
          latex: [
            "F_{AE}=16/\\sqrt{3}\\ \\mathrm{kN}\\ (\\text{vlak})",
            "F_{AB}=-8/\\sqrt{3}\\ \\mathrm{kN}\\ (\\text{tlak})",
          ],
        },
      ],
      results: [
        { symbol: "FA", value: "8 kN", meaning: "reakcija A" },
        { symbol: "FD", value: "16 kN", meaning: "reakcija D" },
        { symbol: "FAE", value: "9,24 kN (vlak)", meaning: "dijagonala" },
      ],
    },
    tags: ["rešetka", "warren", "štapovi"],
  },
  {
    id: "m2-relative-motion",
    title: "Kinematika — klipnjača i klip",
    course: "mehanika2",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Kotač polumjera R rotira s ω, α. Klipnjača AB duljine ℓ; klip B klizi u horizontalnoj vodilici. Za φ odrediti vB i aB.",
    given: [
      "R = 0,15 m",
      "ℓ = 0,6 m",
      "ω = 10 rad/s",
      "α = 4 rad/s²",
      "φ = 40°",
    ],
    sketch: {
      viewBox: "0 0 700 360",
      elements: [
        {
          id: "ground",
          kind: "beam",
          points: [
            { x: 40, y: 300 },
            { x: 660, y: 300 },
          ],
          dashed: true,
        },
        {
          id: "crank",
          kind: "rod",
          points: [
            { x: 200, y: 220 },
            { x: 280, y: 160 },
          ],
          label: "OA",
        },
        {
          id: "conrod",
          kind: "rod",
          points: [
            { x: 280, y: 160 },
            { x: 520, y: 220 },
          ],
          label: "AB",
        },
      ],
      supports: [
        { id: "O", kind: "hinge", at: { x: 200, y: 220 }, label: "O" },
        { id: "A", kind: "hinge", at: { x: 280, y: 160 }, label: "A" },
        {
          id: "B",
          kind: "roller",
          at: { x: 520, y: 220 },
          label: "B",
          orientationDeg: 90,
        },
      ],
      forces: [
        {
          id: "omega",
          at: { x: 200, y: 220 },
          angleDeg: 0,
          magnitude: 10,
          unit: "rad/s",
          label: "ω,α",
          kind: "moment",
          sense: "ccw",
          color: "#38bdf8",
        },
      ],
      labels: [
        { text: "φ", at: { x: 230, y: 200 }, kind: "dim" },
        { text: "vB →", at: { x: 560, y: 210 }, kind: "note" },
        { text: "R", at: { x: 230, y: 250 }, kind: "dim" },
      ],
    },
    solution: {
      summary:
        "vA = ω×rA. Relativna kinematika: vB = vA + ωAB×rB/A. Analogno za ubrzanja s α i centripetalnim članovima.",
      forces: [
        {
          id: "kin",
          label: "vA, vB, aB",
          direction: "vB horizontalno uz vodilicu",
          application: "točke A, B",
          why: "Kinematika — brzine/ubrzanja, ne sile (dinamika slijedi Newtonom).",
        },
      ],
      equations: [
        "\\vec{v}_B=\\vec{v}_A+\\vec{\\omega}_{AB}\\times\\vec{r}_{B/A}",
        "\\vec{a}_B=\\vec{a}_A+\\vec{\\alpha}_{AB}\\times\\vec{r}_{B/A}+\\vec{\\omega}_{AB}\\times(\\vec{\\omega}_{AB}\\times\\vec{r}_{B/A})",
      ],
      steps: [
        {
          title: "Brzina točke A",
          body: "A na kotaču: |vA| = ωR.",
          latex: [
            "v_A = 10\\cdot 0{,}15 = 1{,}5\\ \\mathrm{m/s}",
            "\\vec{v}_A \\perp OA",
          ],
        },
        {
          title: "Relativna brzina → vB, ωAB",
          body: "Projekcije na x (vodilica) i y.",
          latex: [
            "v_B \\approx 1{,}18\\ \\mathrm{m/s}\\ (\\rightarrow)",
            "\\omega_{AB} \\approx 2{,}4\\ \\mathrm{rad/s}",
          ],
        },
        {
          title: "Ubrzanje",
          body: "aA ima tangencijalnu (αR) i normalnu (ω²R) komponentu.",
          latex: [
            "a_A^t = \\alpha R = 0{,}6\\ \\mathrm{m/s^2}",
            "a_A^n = \\omega^2 R = 15\\ \\mathrm{m/s^2}",
            "a_B \\approx 12{,}4\\ \\mathrm{m/s^2}",
          ],
          note: "Predznak aB: + u smjeru +x vodilice.",
        },
      ],
      results: [
        { symbol: "vA", value: "1,5 m/s", meaning: "brzina spoja A" },
        { symbol: "vB", value: "≈ 1,18 m/s", meaning: "brzina klipa" },
        { symbol: "aB", value: "≈ 12,4 m/s²", meaning: "ubrzanje klipa" },
      ],
    },
    tags: ["kinematika", "klipnjača", "relativno"],
  },
  {
    id: "m2-energy-dynamics",
    title: "Dinamika — princip rada i energije",
    course: "mehanika2",
    mode: "2d",
    difficulty: "ispitni",
    statement:
      "Blok mase m kreće se iz mirovanja niz hrapavu kosinu duljine s. Odrediti brzinu na dnu koristeći princip rada i energije; usporediti s Newtonom II.",
    given: ["m = 12 kg", "α = 35°", "μk = 0,25", "s = 4 m", "v0 = 0"],
    sketch: {
      viewBox: "0 0 640 360",
      elements: [
        {
          id: "ramp",
          kind: "beam",
          points: [
            { x: 80, y: 100 },
            { x: 560, y: 300 },
          ],
        },
        {
          id: "block",
          kind: "frame",
          points: [
            { x: 200, y: 140 },
            { x: 250, y: 125 },
            { x: 265, y: 165 },
            { x: 215, y: 180 },
            { x: 200, y: 140 },
          ],
        },
      ],
      supports: [],
      forces: [
        {
          id: "G",
          at: { x: 230, y: 155 },
          angleDeg: -90,
          magnitude: 117.7,
          unit: "N",
          label: "G",
          color: "#ef4444",
        },
        {
          id: "N",
          at: { x: 230, y: 170 },
          angleDeg: 55,
          magnitude: 96,
          unit: "N",
          label: "N",
          color: "#38bdf8",
        },
        {
          id: "T",
          at: { x: 210, y: 160 },
          angleDeg: 145,
          magnitude: 24,
          unit: "N",
          label: "T",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "α = 35°", at: { x: 120, y: 300 }, kind: "dim" },
        { text: "s = 4 m", at: { x: 360, y: 220 }, kind: "dim" },
      ],
    },
    solution: {
      summary:
        "T1 + ΣU1→2 = T2. Rad težine mgs·sinα, rad trenja −μk N s, N = mg cosα. Iz T2 = ½mv² slijedi v.",
      forces: [
        {
          id: "G",
          label: "G",
          direction: "vertikalno dolje",
          application: "težište",
          why: "Težina — rad na putu s·sinα (vertikalni pad).",
        },
        {
          id: "T",
          label: "T=μkN",
          direction: "uz kosinu (suprotno gibanju)",
          application: "dodir",
          why: "Trenje čini negativan rad −Ts.",
        },
      ],
      equations: [
        "N=mg\\cos\\alpha",
        "\\tfrac12 m v^2 - 0 = mg s\\sin\\alpha - \\mu_k N s",
      ],
      steps: [
        {
          title: "Normalna i trenje",
          body: "Nema ubrzanja okomito na kosinu.",
          latex: [
            "N = 12\\cdot 9{,}81\\cdot\\cos 35^\\circ = 96{,}36\\ \\mathrm{N}",
            "T = 0{,}25\\cdot 96{,}36 = 24{,}09\\ \\mathrm{N}",
          ],
        },
        {
          title: "Princip rada i energije",
          body: "Od mirovanja do dna.",
          latex: [
            "\\tfrac12 m v^2 = m g s\\sin 35^\\circ - T s",
            "v = \\sqrt{2(g s\\sin\\alpha - Ts/m)} = 5{,}52\\ \\mathrm{m/s}",
          ],
        },
        {
          title: "Provjera Newtonom II",
          body: "a = g(sinα − μk cosα), v² = 2as.",
          latex: [
            "a = 3{,}80\\ \\mathrm{m/s^2}",
            "v = \\sqrt{2as} = 5{,}52\\ \\mathrm{m/s}",
          ],
          note: "Isti rezultat — energijski pristup i Newton II su konzistentni.",
        },
      ],
      results: [
        { symbol: "N", value: "96,36 N", meaning: "normala" },
        { symbol: "T", value: "24,09 N", meaning: "trenje" },
        { symbol: "v", value: "5,52 m/s", meaning: "brzina na dnu" },
      ],
    },
    tags: ["dinamika", "energija", "trenje"],
  },
  {
    id: "mdt-ntm-toan",
    title: "MDT — nosač s dva segmenta q i F",
    course: "mdt",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Nosač AB duljine 6 m: q = 3 kN/m na 0–3 m, F = 9 kN u x = 4,5 m. Oslonci: zglob A, pokretni B. Nacrtati N, T, M s kotama.",
    given: ["q = 3 kN/m (0–3 m)", "F = 9 kN @ 4,5 m", "L = 6 m"],
    sketch: {
      viewBox: "0 0 720 500",
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
          magnitude: 3,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: 280,
          color: "#38bdf8",
        },
        {
          id: "F",
          at: { x: 500, y: 120 },
          angleDeg: -90,
          magnitude: 9,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "3 m", at: { x: 200, y: 155 }, kind: "dim" },
        { text: "1,5 m", at: { x: 420, y: 155 }, kind: "dim" },
        { text: "1,5 m", at: { x: 560, y: 155 }, kind: "dim" },
      ],
      diagrams: {
        maxN: 1,
        maxT: 12,
        maxM: 20,
        stations: [
          { x: 0, N: 0, T: 10.125, M: 0 },
          { x: 1.5, N: 0, T: 5.625, M: 11.81 },
          { x: 3, N: 0, T: 1.125, M: 15.19 },
          { x: 4.5, N: 0, T: 1.125, M: 16.88 },
          { x: 4.51, N: 0, T: -7.875, M: 16.88 },
          { x: 6, N: 0, T: -7.875, M: 0 },
        ],
      },
    },
    solution: {
      styleNote: "MDT — puni NTM s numeričkim kotama",
      summary:
        "FA = 10,125 kN, FB = 7,875 kN. T opada linearno ispod q, skok −F; M parabola pa linearno do 0 u B.",
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
        "\\sum M_A=0:\\ F_B\\cdot 6 - 3\\cdot 3\\cdot 1{,}5 - 9\\cdot 4{,}5 = 0",
        "\\sum F_y=0:\\ F_A+F_B-9-9=0",
      ],
      steps: [
        {
          title: "Reakcije",
          body: "Q = 9 kN u x = 1,5 m.",
          latex: [
            "F_B = 7{,}875\\ \\mathrm{kN}",
            "F_A = 10{,}125\\ \\mathrm{kN}",
          ],
        },
        {
          title: "T(x) i M(x)",
          body: "Segmenti 0–3, 3–4,5, 4,5–6.",
          latex: [
            "T(0^+)=10{,}125\\ \\mathrm{kN}",
            "T(3)=1{,}125\\ \\mathrm{kN}",
            "T(4{,}5^+)=-7{,}875\\ \\mathrm{kN}",
            "M_{\\max}\\approx 16{,}9\\ \\mathrm{kNm}\\ \\text{uz }x=4{,}5\\mathrm{m}",
          ],
          note: "N(x)=0 (nema aksijalnog opterećenja).",
        },
      ],
      results: [
        { symbol: "FA", value: "10,125 kN", meaning: "reakcija A" },
        { symbol: "FB", value: "7,875 kN", meaning: "reakcija B" },
        { symbol: "Mmax", value: "≈ 16,9 kNm", meaning: "kod F" },
      ],
    },
    tags: ["MDT", "NTM", "nosač"],
  },
];
