import { BUILTIN_TASKS, getTaskById } from "@/data/tasks";
import { generateTask } from "@/lib/generator";
import type {
  AppSettings,
  Course,
  MechTask,
  TaskSolution,
} from "@/lib/types";

const STYLE_FSB =
  "FSB Mehanika I — oslobađanje veza, ΣF = 0, ΣM = 0 (ispitna notacija)";

export interface MatchCandidate {
  id: string;
  title: string;
  score: number;
  course: Course;
  reason: string;
}

/** Apply reference-PDF / style hint without any external LLM. */
export function adaptSolutionStyle(
  solution: TaskSolution,
  styleHint?: string,
  pdfName?: string,
): TaskSolution {
  const fromPdf = pdfName
    ? styleNoteFromPdf(pdfName)
    : undefined;
  const hint = styleHint?.trim();
  return {
    ...solution,
    styleNote: hint || fromPdf || solution.styleNote || STYLE_FSB,
  };
}

function styleNoteFromPdf(pdfName: string): string {
  const n = pdfName.toLowerCase();
  if (n.includes("rjesen") || n.includes("rješen") || n.includes("ispit")) {
    return `Stil: FSB ispitna rješenja (ΣF=0, ΣM=0, FAx…) · „${pdfName}”`;
  }
  if (n.includes("vjezbe") || n.includes("vježbe") || n.includes("saucha")) {
    return `Stil: FSB vježbe / Saucha · „${pdfName}”`;
  }
  return `Stil prilagođen dokumentu „${pdfName}” (lokalno, bez AI).`;
}

export function rankCatalogMatches(
  imageName: string | undefined,
  course: Course,
): MatchCandidate[] {
  const name = (imageName ?? "").toLowerCase();
  const pool =
    course && name
      ? BUILTIN_TASKS
      : BUILTIN_TASKS.filter((t) => t.course === course);

  return pool
    .map((t) => {
      const { score, reason } = scoreNameDetailed(name, t, course);
      return {
        id: t.id,
        title: t.title,
        score,
        course: t.course,
        reason,
      };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

/**
 * Heuristic mapping of uploaded image → closest catalog task.
 */
export function matchTaskFromUpload(opts: {
  imageName?: string;
  course: Course;
  mode: AppSettings["mode"];
  difficulty: AppSettings["difficulty"];
  seed?: number;
  preferredId?: string;
}): MechTask {
  if (opts.preferredId) {
    const pref = getTaskById(opts.preferredId);
    if (pref) {
      return wrapMatch(pref, opts.imageName, opts.seed);
    }
  }

  const ranked = rankCatalogMatches(opts.imageName, opts.course);
  if (ranked[0] && ranked[0].score >= 2) {
    const matched = getTaskById(ranked[0].id)!;
    return wrapMatch(matched, opts.imageName, opts.seed);
  }

  return generateTask(
    opts.course,
    opts.difficulty,
    opts.mode,
    opts.seed ?? Date.now(),
  );
}

function wrapMatch(matched: MechTask, imageName?: string, seed?: number): MechTask {
  return {
    ...matched,
    id: `upload-match-${matched.id}-${seed ?? Date.now()}`,
    title: `${matched.title} (prema slici)`,
    solution: adaptSolutionStyle(matched.solution, undefined, imageName),
  };
}

function scoreNameDetailed(
  name: string,
  t: MechTask,
  preferredCourse: Course,
): { score: number; reason: string } {
  if (!name) {
    return {
      score: t.course === preferredCourse ? 0.5 : 0,
      reason: "bez imena datoteke",
    };
  }
  let s = 0;
  const reasons: string[] = [];
  const hay = `${t.title} ${t.tags?.join(" ") ?? ""} ${t.id} ${t.statement}`.toLowerCase();

  const rules: { keys: string[]; weight: number; label: string }[] = [
    { keys: ["okvir", "frame", "abcd"], weight: 5, label: "okvir" },
    { keys: ["ukljest", "uklješt", "clamp", "fixed", "konzol"], weight: 4, label: "uklještenje" },
    { keys: ["rešetk", "resetk", "truss", "warren", "štapov", "stapov"], weight: 5, label: "rešetka" },
    { keys: ["kabel", "uzad", "užad", "cable", "uže"], weight: 5, label: "kabel/užad" },
    { keys: ["nosač", "nosac", "greda", "beam"], weight: 3, label: "nosač" },
    { keys: ["ntm", "dijagram", "savijan", "mdt"], weight: 4, label: "NTM/MDT" },
    { keys: ["trenj", "bubanj", "valjak", "µ", "mu"], weight: 5, label: "trenje" },
    { keys: ["3d", "prostor"], weight: 4, label: "3D" },
    { keys: ["kinemat", "klip", "omega", "ω"], weight: 5, label: "kinematika" },
    { keys: ["dinam", "energ", "kosina", "newton"], weight: 4, label: "dinamika" },
    { keys: ["ispit", "2022", "rjesen", "rješen"], weight: 2, label: "ispit" },
  ];

  for (const rule of rules) {
    const inName = rule.keys.some((k) => name.includes(k));
    const inTask = rule.keys.some((k) => hay.includes(k));
    if (inName && inTask) {
      s += rule.weight;
      reasons.push(rule.label);
    } else if (inName && t.tags?.some((tag) => rule.keys.some((k) => tag.includes(k)))) {
      s += rule.weight - 1;
      reasons.push(rule.label);
    }
  }

  if (t.course === preferredCourse) s += 1.5;
  if (name.includes("mdt") && t.course === "mdt") s += 3;
  if ((name.includes("meh2") || name.includes("mehanika_2") || name.includes("mehanika2")) && t.course === "mehanika2") {
    s += 3;
  }
  if (name.includes("ispit") && t.difficulty === "ispitni") s += 2;

  return {
    score: s,
    reason: reasons.length ? reasons.slice(0, 3).join(", ") : "slaba podudarnost",
  };
}

export function resolveLocalSolution(
  task: MechTask,
  settings: AppSettings,
): { task: MechTask; note: string } {
  const solution = adaptSolutionStyle(
    task.solution,
    settings.styleHint,
    settings.pdfName,
  );

  const bits = [
    "Lokalni FSB solver — bez OpenAI / Vision.",
    settings.pdfName ? `Referenca stila: ${settings.pdfName}.` : null,
    settings.imageName
      ? `Slika „${settings.imageName}” kao referenca; rješenje iz kataloga/generatora.`
      : null,
  ].filter(Boolean);

  return {
    task: { ...task, solution },
    note: bits.join(" "),
  };
}
