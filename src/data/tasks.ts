import { EXAM_CATALOG } from "@/data/exam-catalog";
import type { MechTask } from "@/lib/types";

/** Core demo set — notation mirrors Mehanika I ispit rješenja. */
const CORE_TASKS: MechTask[] = [
  {
    id: "m1-beam-demo",
    title: "Nosač AB s silom F i momentom M",
    course: "mehanika1",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Za nosač zadan i opterećen prema slici potrebno je osloboditi nosač veza s okolinom, odrediti reakcije u osloncima A (zglob) i B (pokretni oslonac) te napisati jednadžbe ravnoteže ΣFx = 0, ΣFy = 0, ΣM = 0 u FSB notaciji.",
    given: ["F = 2qa", "M = qa²", "duljine: 3a, 2a, 2a, a", "a = 1 m", "q = 10 kN/m"],
    sketch: {
      viewBox: "0 0 720 340",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 80, y: 160 },
            { x: 640, y: 160 },
          ],
          label: "AB",
        },
      ],
      supports: [
        { id: "A", kind: "pin", at: { x: 80, y: 160 }, label: "A" },
        {
          id: "B",
          kind: "roller",
          at: { x: 640, y: 160 },
          label: "B",
          orientationDeg: 0,
        },
      ],
      forces: [
        {
          id: "F",
          at: { x: 320, y: 160 },
          angleDeg: -90,
          magnitude: 20,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
        {
          id: "M",
          at: { x: 480, y: 160 },
          angleDeg: 0,
          magnitude: 10,
          unit: "kNm",
          label: "M",
          kind: "moment",
          sense: "cw",
          color: "#f59e0b",
        },
        {
          id: "q",
          at: { x: 80, y: 160 },
          angleDeg: -90,
          magnitude: 10,
          unit: "kN/m",
          label: "q",
          kind: "distributed",
          length: 240,
          color: "#38bdf8",
        },
      ],
      labels: [
        { text: "3a", at: { x: 200, y: 210 }, kind: "dim" },
        { text: "2a", at: { x: 400, y: 210 }, kind: "dim" },
        { text: "2a", at: { x: 520, y: 210 }, kind: "dim" },
        { text: "a", at: { x: 600, y: 210 }, kind: "dim" },
        { text: "x", at: { x: 660, y: 155 }, kind: "note" },
        { text: "y", at: { x: 70, y: 70 }, kind: "note" },
      ],
    },
    solution: {
      styleNote: "FSB Mehanika I — oslobađanje veza, ΣF = 0, ΣM = 0",
      summary:
        "Nosač je statički određen. U A djeluju FAx i FAy (zglob), u B vertikalna reakcija FB (pokretni oslonac). Raspodijeljeno opterećenje q zamijenimo rezultantom Q = q·3a u težištu segmenta.",
      forces: [
        {
          id: "FAx",
          label: "FAx",
          direction: "horizontalno (+x pretpostavka)",
          application: "točka A",
          why: "Zglob (nepomični oslonac) prenosi horizontalnu i vertikalnu silu; smjer biramo pozitivnim, predznak će potvrditi ili ispraviti pretpostavku.",
          components: "FAx",
        },
        {
          id: "FAy",
          label: "FAy",
          direction: "vertikalno (+y prema gore)",
          application: "točka A",
          why: "Zglob A može razvijati reakciju okomito na podlogu.",
        },
        {
          id: "FB",
          label: "FB",
          direction: "vertikalno (+y prema gore)",
          application: "točka B",
          why: "Pokretni oslonac (valjak) prenosi samo silu okomito na podlogu; nema horizontalne reakcije.",
        },
        {
          id: "F",
          label: "F",
          direction: "dolje (−y)",
          application: "na udaljenosti 3a od A",
          why: "Koncentrirana sila zadana na slici; smjer je zadani (prema dolje).",
        },
        {
          id: "Q",
          label: "Q = q·3a",
          direction: "dolje (−y)",
          application: "težište raspodjele, 1,5a od A",
          why: "Raspodijeljeno opterećenje zamjenjuje se rezultantom u težištu pravokutnog dijagrama.",
        },
        {
          id: "M",
          label: "M",
          direction: "u smjeru kazaljke na satu (cw)",
          application: "na udaljenosti 5a od A",
          why: "Zadani koncentrirani moment; smjer prema slici.",
        },
      ],
      equations: [
        "\\sum F_x = 0:\\quad F_{Ax} = 0",
        "\\sum F_y = 0:\\quad F_{Ay} + F_B - Q - F = 0",
        "\\sum M_A = 0:\\quad -Q\\cdot 1{,}5a - F\\cdot 3a + M + F_B\\cdot 8a = 0",
      ],
      steps: [
        {
          title: "1. Oslobađanje veza (FBD)",
          body: "Uklonimo oslonce i zamijenimo ih reakcijama: u A → FAx, FAy; u B → FB. Zadržimo zadane opterećenja F, M i q.",
          latex: [
            "Q = q\\cdot 3a = 10\\cdot 3 = 30\\ \\mathrm{kN}",
            "F = 2qa = 20\\ \\mathrm{kN}",
            "M = qa^2 = 10\\ \\mathrm{kNm}",
          ],
        },
        {
          title: "2. ΣFx = 0",
          body: "Nema vanjskih horizontalnih sila, stoga je horizontalna reakcija u zglobu nula.",
          latex: ["F_{Ax} = 0"],
          note: "Ako bi se pojavila kosa sila ili kabel, FAx bi bio različit od nule.",
        },
        {
          title: "3. ΣMA = 0 → FB",
          body: "Moment za A eliminira nepoznate reakcije u A. Pozitivan smjer: protiv kazaljke na satu (FSB konvencija za ΣM u ovom rješenju).",
          latex: [
            "F_B\\cdot 8a = Q\\cdot 1{,}5a + F\\cdot 3a - M",
            "F_B = \\dfrac{30\\cdot 1{,}5 + 20\\cdot 3 - 10}{8} = 8{,}125\\ \\mathrm{kN}",
          ],
          note: "Pozitivan FB znači da je pretpostavljeni smjer (prema gore) točan — oslonac gura nosač prema gore.",
        },
        {
          title: "4. ΣFy = 0 → FAy",
          body: "Vertikalna ravnoteža daje reakciju u A.",
          latex: [
            "F_{Ay} = Q + F - F_B = 30 + 20 - 8{,}125 = 41{,}875\\ \\mathrm{kN}",
          ],
          note: "Negativan predznak bi značio da je stvarni smjer suprotan pretpostavljenom.",
        },
      ],
      results: [
        { symbol: "FAx", value: "0 kN", meaning: "nema horizontalnog opterećenja" },
        {
          symbol: "FAy",
          value: "41,875 kN ↑",
          meaning: "zglob A nosi veći dio vertikalnog opterećenja",
        },
        {
          symbol: "FB",
          value: "8,125 kN ↑",
          meaning: "pokretni oslonac B; samo vertikalna sila",
        },
      ],
    },
    tags: ["nosač", "reakcije", "demo"],
  },
  {
    id: "m1-truss-easy",
    title: "Jednostavna rešetka ABC",
    course: "mehanika1",
    mode: "2d",
    difficulty: "lako",
    statement:
      "Za ravninsku rešetku ABC odrediti sile u štapovima metodom čvorova. Štapovi su zglobno spojeni; vanjska sila F djeluje u čvoru C.",
    given: ["F = 10 kN", "kutovi 45°", "duljina AB = AC = 2 m"],
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
          magnitude: 10,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "A", at: { x: 100, y: 310 }, kind: "point" },
        { text: "B", at: { x: 320, y: 80 }, kind: "point" },
        { text: "C", at: { x: 540, y: 310 }, kind: "point" },
        { text: "45°", at: { x: 200, y: 200 }, kind: "dim" },
      ],
    },
    solution: {
      summary:
        "Rešetka je statički određena. Najprije reakcije, zatim metoda čvorova. Štap pod vlakom: pozitivna sila (povlači čvor); pod tlakom: negativna.",
      forces: [
        {
          id: "FAB",
          label: "FAB",
          direction: "uzduž štapa AB",
          application: "čvorovi A i B",
          why: "Štap (idealni) prenosi samo aksijalnu silu — vlačnu ili tlačnu, nikad poprečnu.",
        },
        {
          id: "FAC",
          label: "FAC",
          direction: "uzduž štapa AC (horizontalno)",
          application: "čvorovi A i C",
          why: "Štap — samo N sila.",
        },
        {
          id: "FBC",
          label: "FBC",
          direction: "uzduž štapa BC",
          application: "čvorovi B i C",
          why: "Štap — samo N sila.",
        },
      ],
      equations: [
        "\\sum M_A = 0:\\quad F_C\\cdot 4 - F\\cdot 0 = 0 \\Rightarrow F_C = 0\\ \\text{(vert. na C od F već u čvoru)}",
        "\\text{Čvor C:}\\quad \\sum F_y = 0,\\ \\sum F_x = 0",
      ],
      steps: [
        {
          title: "1. Reakcije",
          body: "ΣMA = 0 i ΣFy = 0 daju vertikalne reakcije. Horizontalna reakcija u A uravnotežuje horizontalne komponente štapova.",
          latex: ["F_{Ay} = F = 10\\ \\mathrm{kN}", "F_{Cx} = 0\\ \\text{(nema vanjskog Fx)}"],
        },
        {
          title: "2. Čvor C",
          body: "Iz ΣFy u C slijedi sila u BC; iz ΣFx sila u AC.",
          latex: [
            "F_{BC}\\sin 45^\\circ = F \\Rightarrow F_{BC} = 10\\sqrt{2}\\ \\mathrm{kN}\\ (\\text{vlak})",
            "F_{AC} = F_{BC}\\cos 45^\\circ = 10\\ \\mathrm{kN}\\ (\\text{tlak})",
          ],
        },
        {
          title: "3. Čvor B / kontrola",
          body: "ΣFx i ΣFy u B daju FAB i potvrđuju prethodne rezultate.",
          latex: ["F_{AB} = 10\\sqrt{2}\\ \\mathrm{kN}\\ (\\text{tlak})"],
        },
      ],
      results: [
        { symbol: "FAB", value: "14,14 kN (tlak)", meaning: "štap AB tlačen" },
        { symbol: "FAC", value: "10 kN (tlak)", meaning: "štap AC tlačen" },
        { symbol: "FBC", value: "14,14 kN (vlak)", meaning: "štap BC vučen" },
      ],
    },
    tags: ["rešetka", "štapovi"],
  },
  {
    id: "m1-frame-3d",
    title: "Okvir ABCD uklješten u A (3D)",
    course: "mehanika1",
    mode: "3d",
    difficulty: "ispitni",
    statement:
      "Okvir ABCD zanemarive težine uklješten je u točki A te opterećen silama i momentima prema slici. Potrebno osloboditi okvir veza s okolinom te izračunati iznose pojedinih sila (FSB ispitni stil).",
    given: [
      "F1 = 100 N",
      "F2 = 70 N",
      "F3 = 80 N",
      "M1 = 50 Nm",
      "M2 = 30 Nm",
      "a = 4 m, b = 3 m, c = 2 m, ℓ = 1 m",
    ],
    sketch: {
      viewBox: "0 0 700 420",
      elements: [
        {
          id: "AB",
          kind: "frame",
          points: [
            { x: 180, y: 300 },
            { x: 420, y: 220 },
          ],
          label: "AB",
        },
        {
          id: "BC",
          kind: "frame",
          points: [
            { x: 420, y: 220 },
            { x: 520, y: 120 },
          ],
          label: "BC",
        },
        {
          id: "CD",
          kind: "frame",
          points: [
            { x: 520, y: 120 },
            { x: 300, y: 160 },
          ],
          label: "CD",
        },
        {
          id: "DA",
          kind: "frame",
          points: [
            { x: 300, y: 160 },
            { x: 180, y: 300 },
          ],
          label: "DA",
        },
      ],
      supports: [
        { id: "A", kind: "fixed", at: { x: 180, y: 300 }, label: "A" },
      ],
      forces: [
        {
          id: "F1",
          at: { x: 420, y: 220 },
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
          at: { x: 300, y: 160 },
          angleDeg: -40,
          magnitude: 80,
          unit: "N",
          label: "F3",
          color: "#a855f7",
        },
        {
          id: "M1",
          at: { x: 250, y: 240 },
          angleDeg: 0,
          magnitude: 50,
          unit: "Nm",
          label: "M1",
          kind: "moment",
          sense: "ccw",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "x", at: { x: 560, y: 310 }, kind: "note" },
        { text: "y", at: { x: 160, y: 80 }, kind: "note" },
        { text: "z", at: { x: 100, y: 280 }, kind: "note" },
        { text: "a,b,c", at: { x: 400, y: 360 }, kind: "dim" },
      ],
    },
    solution: {
      styleNote: "Prema Meh_I ispit 16.9.2022. — uklještenje daje 6 reakcija",
      summary:
        "Uklještenje u A: FAx, FAy, FAz, MAx, MAy, MAz. Sila F3 razlaže se kosinusima smjera. Šest jednadžbi ravnoteže u prostoru.",
      forces: [
        {
          id: "reakcije",
          label: "FAx, FAy, FAz, MAx, MAy, MAz",
          direction: "po osima x,y,z",
          application: "uklještenje A",
          why: "Uklještenje (clamp) sprječava sve pomake i rotacije → 3 sile + 3 momenta.",
        },
        {
          id: "F3",
          label: "F3",
          direction: "kosa u prostoru",
          application: "točka D",
          why: "Komponente: Fx = F3·(c/D), Fy = F3·(a/D), Fz = F3·(b/D), D = √(a²+b²+c²).",
          components: "F3x, F3y, F3z",
        },
      ],
      equations: [
        "\\sum F_x = 0:\\quad F_{Ax} - F_{3x} + \\ldots = 0",
        "\\sum F_y = 0:\\quad F_{Ay} - F_1 + F_{3y} = 0",
        "\\sum F_z = 0:\\quad F_{Az} + F_2 + F_{3z} = 0",
        "\\sum M_x = 0,\\quad \\sum M_y = 0,\\quad \\sum M_z = 0",
      ],
      steps: [
        {
          title: "1. Kosinusi smjera za F3",
          body: "D = √(a²+b²+c²) = √(16+9+4) = √29.",
          latex: [
            "F_{3x} = F_3\\cdot\\frac{c}{D} = 80\\cdot\\frac{2}{\\sqrt{29}}",
            "F_{3y} = F_3\\cdot\\frac{a}{D} = 80\\cdot\\frac{4}{\\sqrt{29}}",
            "F_{3z} = F_3\\cdot\\frac{b}{D} = 80\\cdot\\frac{3}{\\sqrt{29}}",
          ],
        },
        {
          title: "2. ΣF = 0",
          body: "Tri skalarne jednadžbe daju FAx, FAy, FAz.",
          latex: [
            "F_{Ax} = 40{,}289\\ \\mathrm{N}",
            "F_{Ay} = 59{,}423\\ \\mathrm{N}",
            "F_{Az} = 55{,}433\\ \\mathrm{N}",
          ],
        },
        {
          title: "3. ΣM = 0",
          body: "Momenti sila za A + zadani momenti M1, M2 daju MAx, MAy, MAz.",
          latex: [
            "M_{Ax} = 0",
            "M_{Ay} = 71{,}732\\ \\mathrm{Nm}",
            "M_{Az} = 197{,}690\\ \\mathrm{Nm}",
          ],
          note: "Nula za MAx znači da projekcije momenata oko x-osi balansiraju.",
        },
      ],
      results: [
        { symbol: "FAx", value: "40,289 N", meaning: "reakcija uklještenja" },
        { symbol: "FAy", value: "59,423 N", meaning: "reakcija uklještenja" },
        { symbol: "FAz", value: "55,433 N", meaning: "reakcija uklještenja" },
        { symbol: "MAy", value: "71,732 Nm", meaning: "moment uklještenja" },
        { symbol: "MAz", value: "197,690 Nm", meaning: "moment uklještenja" },
      ],
    },
    tags: ["3D", "uklještenje", "ispit"],
  },
  {
    id: "m2-kinematics",
    title: "Kinematika — kotač i klizni blok",
    course: "mehanika2",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Kotač polumjera R kotrlja se bez proklizavanja. Blok B povezan je štapom AB duljine ℓ. Odrediti brzinu i ubrzanje točke B u trenutku kada je kut φ = 30°.",
    given: ["R = 0,2 m", "ℓ = 0,8 m", "ω = 4 rad/s (konstantno)", "φ = 30°"],
    sketch: {
      viewBox: "0 0 680 360",
      elements: [
        {
          id: "ground",
          kind: "beam",
          points: [
            { x: 60, y: 280 },
            { x: 620, y: 280 },
          ],
          dashed: true,
        },
        {
          id: "rod",
          kind: "rod",
          points: [
            { x: 260, y: 200 },
            { x: 480, y: 160 },
          ],
          label: "AB",
        },
      ],
      supports: [
        { id: "A", kind: "hinge", at: { x: 260, y: 200 }, label: "A" },
        { id: "B", kind: "roller", at: { x: 480, y: 160 }, label: "B", orientationDeg: 90 },
      ],
      forces: [
        {
          id: "omega",
          at: { x: 200, y: 220 },
          angleDeg: 0,
          magnitude: 4,
          unit: "rad/s",
          label: "ω",
          kind: "moment",
          sense: "ccw",
          color: "#38bdf8",
        },
      ],
      labels: [
        { text: "R", at: { x: 210, y: 250 }, kind: "dim" },
        { text: "φ", at: { x: 290, y: 230 }, kind: "dim" },
        { text: "vB →", at: { x: 520, y: 150 }, kind: "note" },
      ],
    },
    solution: {
      summary:
        "Kotrljanje bez proklizavanja: vA = ωR (trenutno središte kontakta). Relativna kinematika štapa AB daje vB i aB.",
      forces: [
        {
          id: "kin",
          label: "vA, vB",
          direction: "vA horizontalno; vB uz vodilicu",
          application: "točke A i B",
          why: "Kinematika — ovo nisu sile, već brzine. U dinamici bi slijedile jednadžbe gibanja.",
        },
      ],
      equations: [
        "\\vec{v}_B = \\vec{v}_A + \\vec{\\omega}_{AB}\\times\\vec{r}_{B/A}",
        "v_A = \\omega R",
      ],
      steps: [
        {
          title: "1. Brzina središta kotača",
          body: "Bez proklizavanja: trenutno središte u dodiru s podlogom.",
          latex: ["v_A = \\omega R = 4\\cdot 0{,}2 = 0{,}8\\ \\mathrm{m/s}"],
        },
        {
          title: "2. Relativna brzina",
          body: "Projekcije vektorske jednadžbe na x i y daju ωAB i vB.",
          latex: [
            "v_B = v_A\\cdot\\dfrac{\\cos\\varphi}{\\sin\\varphi}\\ \\text{(za ovu geometriju)}",
            "v_B = 0{,}8\\cdot\\sqrt{3} \\approx 1{,}386\\ \\mathrm{m/s}",
          ],
        },
        {
          title: "3. Ubrzanje",
          body: "Za konstantni ω kotača, aA = 0; derivacija daje aB.",
          latex: ["a_B \\approx 3{,}2\\ \\mathrm{m/s^2}\\ \\text{(prema izvodu za }\\varphi=30^\\circ\\text{)}"],
        },
      ],
      results: [
        { symbol: "vA", value: "0,8 m/s", meaning: "brzina središta kotača" },
        { symbol: "vB", value: "1,386 m/s", meaning: "brzina bloka uz vodilicu" },
        { symbol: "aB", value: "≈ 3,2 m/s²", meaning: "ubrzanje bloka" },
      ],
    },
    tags: ["kinematika", "kotrljanje"],
  },
  {
    id: "m2-dynamics",
    title: "Dinamika — blok na hrapavoj ravnini",
    course: "mehanika2",
    mode: "2d",
    difficulty: "lako",
    statement:
      "Blok mase m na hrapavoj kosini kuta α vuče se silom P usporednom s kosinom. Odrediti ubrzanje bloka.",
    given: ["m = 10 kg", "α = 30°", "μ = 0,2", "P = 60 N", "g = 9,81 m/s²"],
    sketch: {
      viewBox: "0 0 640 360",
      elements: [
        {
          id: "ramp",
          kind: "beam",
          points: [
            { x: 80, y: 280 },
            { x: 560, y: 120 },
          ],
        },
        {
          id: "block",
          kind: "frame",
          points: [
            { x: 260, y: 200 },
            { x: 320, y: 180 },
            { x: 340, y: 220 },
            { x: 280, y: 240 },
            { x: 260, y: 200 },
          ],
        },
      ],
      supports: [],
      forces: [
        {
          id: "P",
          at: { x: 320, y: 190 },
          angleDeg: -28,
          magnitude: 60,
          unit: "N",
          label: "P",
          color: "#22c55e",
        },
        {
          id: "G",
          at: { x: 300, y: 210 },
          angleDeg: -90,
          magnitude: 98.1,
          unit: "N",
          label: "G",
          color: "#ef4444",
        },
        {
          id: "N",
          at: { x: 290, y: 230 },
          angleDeg: 62,
          magnitude: 85,
          unit: "N",
          label: "N",
          color: "#38bdf8",
        },
        {
          id: "T",
          at: { x: 270, y: 220 },
          angleDeg: 152,
          magnitude: 17,
          unit: "N",
          label: "T=μN",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "α = 30°", at: { x: 140, y: 300 }, kind: "dim" },
        { text: "μ = 0,2", at: { x: 400, y: 280 }, kind: "note" },
      ],
    },
    solution: {
      summary:
        "Newtonov II. zakon uzduž i okomito na kosinu. Trenje T = μN suprotno relativnom klizanju (pretpostavka: kretanje uzbrdo).",
      forces: [
        {
          id: "P",
          label: "P",
          direction: "uzbrdo, usporedno s kosinom",
          application: "težište / duž bloka",
          why: "Zadana vučna sila.",
        },
        {
          id: "G",
          label: "G = mg",
          direction: "vertikalno dolje",
          application: "težište",
          why: "Težina — uvijek prema središtu Zemlje.",
        },
        {
          id: "N",
          label: "N",
          direction: "okomito na kosinu, od podloge",
          application: "dodirna ploha",
          why: "Normalna reakcija glatke/hrapave podloge — nema komponente uzduž podloge.",
        },
        {
          id: "T",
          label: "T = μN",
          direction: "nizbrdo (suprotno klizanju)",
          application: "dodirna ploha",
          why: "Trenje klizanja opire se relativnom gibanju; smjer biramo prema pretpostavljenom kretanju.",
        },
      ],
      equations: [
        "\\sum F_n = 0:\\quad N - mg\\cos\\alpha = 0",
        "\\sum F_t = ma:\\quad P - mg\\sin\\alpha - \\mu N = ma",
      ],
      steps: [
        {
          title: "1. Normalna reakcija",
          body: "Nema ubrzanja okomito na kosinu.",
          latex: ["N = mg\\cos 30^\\circ = 10\\cdot 9{,}81\\cdot\\frac{\\sqrt{3}}{2} = 84{,}96\\ \\mathrm{N}"],
        },
        {
          title: "2. Trenje",
          body: "Kinetičko trenje za klizanje.",
          latex: ["T = \\mu N = 0{,}2\\cdot 84{,}96 = 16{,}99\\ \\mathrm{N}"],
        },
        {
          title: "3. Ubrzanje uzduž kosine",
          body: "Pozitivan smjer uzbrdo.",
          latex: [
            "a = \\dfrac{P - mg\\sin\\alpha - T}{m} = \\dfrac{60 - 49{,}05 - 16{,}99}{10} = -0{,}604\\ \\mathrm{m/s^2}",
          ],
          note: "Negativan a znači da je ubrzanje zapravo nizbrdo — sila P nije dovoljna za kretanje uzbrdo uz trenje.",
        },
      ],
      results: [
        { symbol: "N", value: "84,96 N", meaning: "normalna reakcija" },
        { symbol: "T", value: "16,99 N", meaning: "trenje nizbrdo" },
        {
          symbol: "a",
          value: "−0,604 m/s²",
          meaning: "negativan predznak = smjer nizbrdo",
        },
      ],
    },
    tags: ["dinamika", "trenje"],
  },
  {
    id: "mdt-beam-ntm",
    title: "MDT — dijagrami N, T, M",
    course: "mdt",
    mode: "2d",
    difficulty: "srednje",
    statement:
      "Za nosač zadan i opterećen prema slici skicirati i kotirati dijagrame unutarnjih sila N, T (Q) i momenta savijanja M. Konvencija: pozitivni M 'rasteže donja vlakna'.",
    given: ["q = 2 kN/m", "F = 3qa = 6 kN", "M0 = 2qa² = 4 kNm", "a = 1 m", "raspon L = 4a"],
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
          magnitude: 2,
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
          magnitude: 6,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
        {
          id: "M0",
          at: { x: 560, y: 120 },
          angleDeg: 0,
          magnitude: 4,
          unit: "kNm",
          label: "M",
          kind: "moment",
          sense: "cw",
          color: "#f59e0b",
        },
      ],
      labels: [
        { text: "2a", at: { x: 200, y: 150 }, kind: "dim" },
        { text: "a", at: { x: 400, y: 150 }, kind: "dim" },
        { text: "a", at: { x: 520, y: 150 }, kind: "dim" },
        { text: "N, T, M →", at: { x: 300, y: 460 }, kind: "note" },
      ],
      diagrams: {
        maxN: 1,
        maxT: 8,
        maxM: 6,
        stations: [
          { x: 0, N: 0, T: 5.5, M: 0 },
          { x: 1, N: 0, T: 3.5, M: 4.5 },
          { x: 2, N: 0, T: 1.5, M: 6 },
          { x: 2.01, N: 0, T: 1.5, M: 6 },
          { x: 3, N: 0, T: 1.5, M: 4.5 },
          { x: 3.01, N: 0, T: -4.5, M: 4.5 },
          { x: 4, N: 0, T: -4.5, M: 0 },
        ],
      },
    },
    solution: {
      styleNote: "MDT / Mehanika I zad. 3 — dijagrami unutarnjih sila",
      summary:
        "Najprije reakcije, zatim rezovi: N ≈ 0 (nema aksijalnog opterećenja), T(x) i M(x) po segmentima. Skok u T ispod koncentrirane sile; skok u M ispod koncentriranog momenta.",
      forces: [
        {
          id: "FA",
          label: "FA",
          direction: "↑",
          application: "A",
          why: "Zglob — vertikalna reakcija (FAx = 0).",
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
        "\\sum F_y = 0:\\quad F_A + F_B - q\\cdot 2a - F = 0",
        "\\sum M_A = 0:\\quad F_B\\cdot 4a - q\\cdot 2a\\cdot a - F\\cdot 3a + M_0 = 0",
      ],
      steps: [
        {
          title: "1. Reakcije",
          body: "Sa a = 1 m, q = 2 kN/m, F = 6 kN, M0 = 4 kNm.",
          latex: [
            "F_B = \\dfrac{2\\cdot 2\\cdot 1 + 6\\cdot 3 - 4}{4} = 4{,}5\\ \\mathrm{kN}",
            "F_A = 4 + 6 - 4{,}5 = 5{,}5\\ \\mathrm{kN}",
          ],
        },
        {
          title: "2. Poprečna sila T(x)",
          body: "Od A: T(0+) = FA. Ispod q linearno opada; ispod F skok −F.",
          latex: [
            "T(x) = F_A - qx \\quad (0\\le x\\le 2a)",
            "T(2a^+) = T(2a) = 1{,}5\\ \\mathrm{kN}",
            "T(3a^+) = 1{,}5 - 6 = -4{,}5\\ \\mathrm{kN}",
          ],
        },
        {
          title: "3. Moment savijanja M(x)",
          body: "M(0) = M(L) = 0 (zglobovi). Ispod M0 skok za ±M0.",
          latex: [
            "M(x) = F_A x - q x^2/2",
            "M_{\\max}\\approx 6\\ \\mathrm{kNm}\\ \\text{oko } x=2a",
          ],
          note: "Pozitivan M rasteže donja vlakna — standardna FSB/MDT konvencija za nosače.",
        },
      ],
      results: [
        { symbol: "FA", value: "5,5 kN ↑", meaning: "reakcija A" },
        { symbol: "FB", value: "4,5 kN ↑", meaning: "reakcija B" },
        { symbol: "Tmax", value: "5,5 kN", meaning: "uz A" },
        { symbol: "Mmax", value: "≈ 6 kNm", meaning: "oko x = 2a" },
      ],
    },
    tags: ["MDT", "N", "T", "M"],
  },
  {
    id: "mdt-cantilever",
    title: "MDT — konzola s uklještenjem",
    course: "mdt",
    mode: "2d",
    difficulty: "lako",
    statement:
      "Konzola duljine L uklještena u A, opterećena silom F na slobodnom kraju. Odrediti reakcije i dijagrame T i M.",
    given: ["F = 5 kN", "L = 2 m"],
    sketch: {
      viewBox: "0 0 640 420",
      elements: [
        {
          id: "beam",
          kind: "beam",
          points: [
            { x: 120, y: 140 },
            { x: 520, y: 140 },
          ],
        },
      ],
      supports: [
        { id: "A", kind: "fixed", at: { x: 120, y: 140 }, label: "A" },
      ],
      forces: [
        {
          id: "F",
          at: { x: 520, y: 140 },
          angleDeg: -90,
          magnitude: 5,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "L = 2 m", at: { x: 300, y: 180 }, kind: "dim" },
      ],
      diagrams: {
        maxT: 5,
        maxM: 10,
        stations: [
          { x: 0, T: 5, M: -10 },
          { x: 2, T: 5, M: 0 },
        ],
      },
    },
    solution: {
      summary:
        "Uklještenje: vertikalna reakcija FA = F i uklješteni moment MA = F·L. T = const = F; M linearan od −FL do 0.",
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
          direction: "ccw (za F dolje na desnom kraju)",
          application: "A",
          why: "Uklještenje prenosi moment — sprječava rotaciju.",
        },
      ],
      equations: [
        "\\sum F_y = 0:\\quad F_A - F = 0",
        "\\sum M_A = 0:\\quad M_A - F L = 0",
      ],
      steps: [
        {
          title: "Reakcije i dijagrami",
          body: "T(x) = F (const). M(x) = −F(L−x) uz konvenciju predznaka za konzolu.",
          latex: [
            "F_A = 5\\ \\mathrm{kN}",
            "M_A = 10\\ \\mathrm{kNm}",
            "T(x) = 5\\ \\mathrm{kN}",
            "M(0) = -10\\ \\mathrm{kNm},\\ M(L) = 0",
          ],
        },
      ],
      results: [
        { symbol: "FA", value: "5 kN", meaning: "vertikalna reakcija" },
        { symbol: "MA", value: "10 kNm", meaning: "uklješteni moment" },
      ],
    },
    tags: ["konzola", "MDT"],
  },
  {
    id: "m1-cable-rod",
    title: "Kabel i štap — smjerovi sila",
    course: "mehanika1",
    mode: "2d",
    difficulty: "lako",
    statement:
      "Šipka AB zglobno oslonjena u A, držana kabelom BC. U B djeluje vertikalna sila F. Objasniti smjerove sila u kabelu i štapu te odrediti reakcije.",
    given: ["F = 8 kN", "AB = 3 m", "kut kabla 40°"],
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
          magnitude: 8,
          unit: "kN",
          label: "F",
          color: "#ef4444",
        },
      ],
      labels: [
        { text: "40°", at: { x: 440, y: 220 }, kind: "dim" },
      ],
    },
    solution: {
      summary:
        "Kabel može samo vuci (vlak prema C). Štap AB (zglob–zglob) prenosi aksijalnu silu; ovdje je tipično tlačen. Zglob A: FAx, FAy.",
      forces: [
        {
          id: "S",
          label: "S (kabel)",
          direction: "od B prema C (vlak)",
          application: "duž kabla",
          why: "Kabel/užе ne može tlačiti — sila je uvijek vlačna, uzduž geometrije kabla.",
        },
        {
          id: "N",
          label: "N (štap)",
          direction: "uzduž AB",
          application: "duž štapa",
          why: "Idealni štap: samo N. Smjer (vlak/tlak) određuje se iz ravnoteže — ovdje tlak.",
        },
      ],
      equations: [
        "\\sum F_x = 0:\\quad F_{Ax} + S\\cos 40^\\circ = 0",
        "\\sum F_y = 0:\\quad F_{Ay} + S\\sin 40^\\circ - F = 0",
        "\\sum M_A = 0:\\quad S\\sin 40^\\circ\\cdot 3 - F\\cdot 3 = 0",
      ],
      steps: [
        {
          title: "Moment za A",
          body: "Eliminira reakcije u A; sila štapa prolazi kroz A pa nema momenta.",
          latex: [
            "S = \\dfrac{F}{\\sin 40^\\circ} = \\dfrac{8}{0{,}6428} = 12{,}45\\ \\mathrm{kN}\\ (\\text{vlak})",
          ],
        },
        {
          title: "Reakcije u A",
          body: "Iz ΣFx i ΣFy.",
          latex: [
            "F_{Ax} = -S\\cos 40^\\circ = -9{,}54\\ \\mathrm{kN}",
            "F_{Ay} = F - S\\sin 40^\\circ = 0",
          ],
          note: "Negativan FAx: stvarni smjer je suprotan pretpostavci (+x) — prema lijevo.",
        },
      ],
      results: [
        { symbol: "S", value: "12,45 kN (vlak)", meaning: "kabel vuče" },
        { symbol: "FAx", value: "−9,54 kN", meaning: "predznak → smjer ulijevo" },
        { symbol: "FAy", value: "0", meaning: "vertikale nose kabel + F" },
      ],
    },
    tags: ["kabel", "štap", "smjerovi"],
  },
];

/** Full built-in catalog: core demos + FSB ispit / vježbe stil. */
export const BUILTIN_TASKS: MechTask[] = [...CORE_TASKS, ...EXAM_CATALOG];

export const DEMO_TASK_ID = "m1-beam-demo";

export function getTaskById(id: string): MechTask | undefined {
  return BUILTIN_TASKS.find((t) => t.id === id);
}

export function tasksFor(course: MechTask["course"], difficulty?: MechTask["difficulty"]) {
  return BUILTIN_TASKS.filter(
    (t) => t.course === course && (!difficulty || t.difficulty === difficulty),
  );
}

export function catalogSummary() {
  return BUILTIN_TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    course: t.course,
    difficulty: t.difficulty,
    mode: t.mode,
    tags: t.tags ?? [],
  }));
}
