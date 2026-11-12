
import { SketchCanvas } from "@/components/canvas/SketchCanvas";
import { LeftPanel } from "@/components/panels/LeftPanel";
import { SolutionPanel } from "@/components/panels/SolutionPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BUILTIN_TASKS, DEMO_TASK_ID, getTaskById } from "@/data/tasks";
import { generateTask, listCatalog } from "@/lib/generator";
import {
  matchTaskFromUpload,
  rankCatalogMatches,
  resolveLocalSolution,
  type MatchCandidate,
} from "@/lib/local-solver";
import type { AppSettings, MechTask } from "@/lib/types";
import { AlertTriangle, Compass, Loader2, Moon, SunMedium } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

type Status = "idle" | "loading" | "error";

export function MehanikaWorkspace() {
  const demo = getTaskById(DEMO_TASK_ID) ?? BUILTIN_TASKS[0];
  const [task, setTask] = useState<MechTask>(demo);
  const [settings, setSettings] = useState<AppSettings>({
    mode: demo.mode,
    course: demo.course,
    difficulty: demo.difficulty,
  });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [aiNote, setAiNote] = useState<string | null>(
    "Lokalni FSB solver — puno korak-po-korak rješenje bez API ključa.",
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [viewMode, setViewMode] = useState<"skica" | "fbd">("skica");
  const [mobileTab, setMobileTab] = useState<"unos" | "skica" | "rjesenje">("skica");
  const genCount = useRef(0);

  const catalog = useMemo(() => listCatalog(), []);

  const applyLocal = useCallback(
    (next: MechTask, patch?: Partial<AppSettings>) => {
      const merged = { ...settings, ...patch };
      const { task: resolved, note } = resolveLocalSolution(next, merged);
      setTask(resolved);
      setAiNote(note);
      setErrorMsg(null);
      setStatus("idle");
    },
    [settings],
  );

  const patchSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const onImageFile = useCallback(
    (file: File) => {
      try {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        const nextSettings = { ...settings, imageName: file.name };
        setSettings(nextSettings);
        const ranked = rankCatalogMatches(file.name, nextSettings.course);
        setMatches(ranked);
        const matched = matchTaskFromUpload({
          imageName: file.name,
          course: nextSettings.course,
          mode: nextSettings.mode,
          difficulty: nextSettings.difficulty,
          seed: Date.now(),
          preferredId: ranked[0]?.id,
        });
        applyLocal(matched, nextSettings);
        setViewMode("skica");
        setMobileTab("skica");
        setAiNote(
          ranked[0]
            ? `Mapirano na „${ranked[0].title}” (${ranked[0].reason}). Odaberi drugi prijedlog lijevo ako treba.`
            : `Slika učitana — generiran lokalni zadatak za ${nextSettings.course}.`,
        );
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "Greška pri učitavanju slike.");
      }
    },
    [applyLocal, imageUrl, settings],
  );

  const onPdfFile = useCallback(
    (file: File) => {
      const patch: Partial<AppSettings> = {
        pdfName: file.name,
        styleHint: `Koristi stil i notaciju iz dokumenta „${file.name}” (FSB Mehanika, lokalno).`,
      };
      setSettings((s) => ({ ...s, ...patch }));
      applyLocal(task, patch);
    },
    [applyLocal, task],
  );

  const onPickMatch = (id: string) => {
    const matched = matchTaskFromUpload({
      imageName: settings.imageName,
      course: settings.course,
      mode: settings.mode,
      difficulty: settings.difficulty,
      seed: Date.now(),
      preferredId: id,
    });
    applyLocal(matched);
    setMobileTab("skica");
  };

  /** Fully client-side — no API / OpenAI (GitHub Pages safe). */
  const runSolveAssist = useCallback(
    (current: MechTask) => {
      setStatus("loading");
      setErrorMsg(null);
      try {
        const { task: resolved, note } = resolveLocalSolution(current, settings);
        setTask(resolved);
        setAiNote(note);
        setStatus("idle");
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "Solver nije dostupan.");
        setAiNote("Lokalni solver aktivan (offline).");
      }
    },
    [settings],
  );

  const onGenerate = () => {
    genCount.current += 1;
    const next = generateTask(
      settings.course,
      settings.difficulty,
      settings.mode,
      genCount.current,
    );
    setTask(next);
    setViewMode("skica");
    setAiNote(`Generirano #${genCount.current}: ${next.title}`);
    setMobileTab("skica");
    setErrorMsg(null);
    setStatus("idle");
    // Apply local solution synchronously so UI updates immediately
    const { task: resolved, note } = resolveLocalSolution(next, settings);
    setTask(resolved);
    setAiNote(
      `Generirano #${genCount.current}: ${resolved.title} — ${note}`,
    );
  };

  const onSelectTask = (id: string) => {
    const t = getTaskById(id);
    if (!t) {
      setStatus("error");
      setErrorMsg(`Zadatak ${id} nije pronađen.`);
      return;
    }
    setSettings((s) => ({
      ...s,
      course: t.course,
      mode: t.mode,
      difficulty: t.difficulty,
    }));
    setViewMode("skica");
    setMobileTab("skica");
    runSolveAssist(t);
  };

  const statusBadge = task.id.startsWith("gen-")
    ? `Gen #${genCount.current || "?"}`
    : task.id.includes("upload-match")
      ? "Prema slici"
      : "Demo učitan";

  return (
    <div
      className={`mehanika-shell min-h-screen ${theme === "light" ? "theme-light" : "theme-dark"}`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--glow),_transparent_55%)]" />
      </div>

      <header className="flex items-center justify-between border-b border-[var(--panel-border)] px-3 py-2.5 md:px-6 md:py-3">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 md:h-10 md:w-10">
            <Compass className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display)] text-xl leading-none tracking-tight text-[var(--brand)] md:text-3xl">
              Mehanika
            </h1>
            <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.18em] text-slate-400 md:text-[11px] md:tracking-[0.22em]">
              FSB · Statika · Kinematika · MDT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "loading" && (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
          )}
          <Badge variant="mute" className="hidden sm:inline-flex">
            {statusBadge}
          </Badge>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tema"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {errorMsg && (
        <div className="flex items-center gap-2 border-b border-rose-800/40 bg-rose-950/40 px-4 py-2 text-sm text-rose-100">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{errorMsg}</span>
          <button
            type="button"
            className="text-xs underline"
            onClick={() => {
              setErrorMsg(null);
              setStatus("idle");
            }}
          >
            Zatvori
          </button>
        </div>
      )}

      {/* Mobile tabs */}
      <div className="grid grid-cols-3 border-b border-[var(--panel-border)] lg:hidden">
        {(
          [
            ["unos", "Unos"],
            ["skica", "Skica"],
            ["rjesenje", "Rješenje"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            className={`py-2 text-xs uppercase tracking-wider ${
              mobileTab === id
                ? "border-b-2 border-cyan-400 text-cyan-100"
                : "text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="grid h-[calc(100vh-96px)] grid-cols-1 lg:h-[calc(100vh-64px)] lg:grid-cols-[300px_minmax(0,1fr)_380px]">
        <aside
          className={`border-b border-[var(--panel-border)] lg:block lg:border-b-0 lg:border-r ${
            mobileTab === "unos" ? "block" : "hidden"
          }`}
        >
          <LeftPanel
            settings={settings}
            onChange={patchSettings}
            onGenerate={onGenerate}
            onImageFile={onImageFile}
            onPdfFile={onPdfFile}
            imagePreviewUrl={imageUrl}
            matchCandidates={matches}
            onPickMatch={onPickMatch}
            catalog={catalog}
            onSelectTask={onSelectTask}
            activeId={task.id}
            task={task}
          />
        </aside>

        <section
          className={`flex min-h-[320px] flex-col border-b border-[var(--panel-border)] p-2 md:p-3 lg:border-b-0 lg:border-r ${
            mobileTab === "skica" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-base text-[var(--fg)] md:text-lg">
                Interaktivna skica
              </h2>
              <p className="truncate text-xs text-slate-400">{task.title}</p>
            </div>
            <Badge>{task.difficulty}</Badge>
          </div>
          <div className="relative min-h-0 flex-1">
            {status === "loading" && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 rounded border border-cyan-800/50 bg-slate-950/90 px-3 py-2 text-sm text-cyan-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Računam rješenje…
                </div>
              </div>
            )}
            <SketchCanvas
              key={task.id}
              task={task}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
            {imageUrl && (
              <div className="absolute bottom-3 right-3 z-20 w-28 overflow-hidden rounded border border-cyan-700/50 bg-slate-950/90 shadow-lg md:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={settings.imageName ?? "Referentna skica"}
                  className="h-20 w-full object-cover md:h-24"
                />
                <p className="truncate px-2 py-1 font-mono text-[10px] text-cyan-200/80">
                  Ref: {settings.imageName}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside
          className={`min-h-0 ${mobileTab === "rjesenje" ? "block" : "hidden lg:block"}`}
        >
          {!task.solution?.steps?.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-400">
              <p>Nema rješenja za prikaz.</p>
              <Button type="button" variant="secondary" onClick={onGenerate}>
                Generiraj zadatak
              </Button>
            </div>
          ) : (
            <SolutionPanel
              task={task}
              aiNote={aiNote}
              solving={status === "loading"}
            />
          )}
        </aside>
      </main>
    </div>
  );
}
