
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MatchCandidate } from "@/lib/local-solver";
import type { AppSettings, Course, Difficulty, MechTask, Mode } from "@/lib/types";
import {
  Box,
  FileUp,
  ImagePlus,
  Layers3,
  Sparkles,
  SquareStack,
} from "lucide-react";
import { useRef } from "react";

interface LeftPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
  onGenerate: () => void;
  onImageFile?: (file: File) => void;
  onPdfFile?: (file: File) => void;
  imagePreviewUrl?: string | null;
  matchCandidates?: MatchCandidate[];
  onPickMatch?: (id: string) => void;
  catalog: { id: string; title: string; course: Course; difficulty: Difficulty }[];
  onSelectTask: (id: string) => void;
  activeId: string;
  task: MechTask;
}

const courses: { id: Course; label: string; hint: string }[] = [
  { id: "mehanika1", label: "Mehanika 1", hint: "Statika" },
  { id: "mehanika2", label: "Mehanika 2", hint: "Kinematika / Dinamika" },
  { id: "mdt", label: "MDT", hint: "Deformabilna tijela" },
];

const difficulties: { id: Difficulty; label: string }[] = [
  { id: "lako", label: "Lako" },
  { id: "srednje", label: "Srednje" },
  { id: "ispitni", label: "Ispitni rok" },
];

export function LeftPanel({
  settings,
  onChange,
  onGenerate,
  onImageFile,
  onPdfFile,
  imagePreviewUrl,
  matchCandidates = [],
  onPickMatch,
  catalog,
  onSelectTask,
  activeId,
  task,
}: LeftPanelProps) {
  const imgRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-cyan-900/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <SquareStack className="h-4 w-4 text-cyan-300" />
          <h2 className="font-[family-name:var(--font-display)] text-lg text-cyan-50">
            Unos i postavke
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Lokalni solver · skica / PDF · generiraj zadatak
        </p>
      </header>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-5">
          <section className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
            <Label className="mb-2 block">Aktivni zadatak</Label>
            <p className="font-[family-name:var(--font-display)] text-sm text-cyan-50">
              {task.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {task.statement}
            </p>
            <ul className="mt-2 space-y-1 font-mono text-[11px] text-cyan-200/80">
              {task.given.map((g) => (
                <li key={g}>· {g}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <Label>Slika zadatka (referenca)</Label>
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onImageFile?.(f);
              }}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-700/50 bg-slate-900/40 px-3 py-5 text-center transition hover:border-cyan-400/60 hover:bg-cyan-950/20"
            >
              {imagePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreviewUrl}
                  alt="Pregled"
                  className="h-20 w-full rounded object-cover"
                />
              ) : (
                <ImagePlus className="h-6 w-6 text-cyan-400" />
              )}
              <span className="text-sm text-slate-200">
                Povuci i ispusti ili klikni
              </span>
              <span className="text-[11px] text-slate-500">
                Prikazuje se uz skicu; ime datoteke pomaže odabiru tipa zadatka
              </span>
              {settings.imageName && (
                <Badge variant="accent">{settings.imageName}</Badge>
              )}
            </button>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImageFile?.(f);
              }}
            />
            {matchCandidates.length > 0 && (
              <div className="space-y-1.5 rounded-md border border-amber-800/40 bg-amber-950/20 p-2">
                <p className="text-[10px] uppercase tracking-wider text-amber-200/80">
                  Prijedlozi iz kataloga
                </p>
                {matchCandidates.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onPickMatch?.(m.id)}
                    className="w-full rounded border border-slate-700/60 bg-slate-950/50 px-2 py-1.5 text-left text-[11px] text-slate-200 hover:border-amber-500/40"
                  >
                    <span className="font-medium text-amber-100">{m.title}</span>
                    <span className="mt-0.5 block text-[10px] text-slate-500">
                      score {m.score.toFixed(1)} · {m.reason}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <Label>Referentni PDF (stil rješenja)</Label>
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-lg border border-cyan-900/50 bg-slate-900/40 px-3 py-3 text-left hover:border-cyan-600/50"
            >
              <FileUp className="h-5 w-5 text-amber-300" />
              <div>
                <div className="text-sm text-slate-200">
                  {settings.pdfName ?? "Učitaj PDF s pravilima pisanja"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Lokalno prilagođava natpis stila (bez cloud AI)
                </div>
              </div>
            </button>
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPdfFile?.(f);
              }}
            />
          </section>

          <Separator />

          <section className="space-y-2">
            <Label>Način</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "2d" as Mode, label: "2D Sustav", icon: Layers3 },
                  { id: "3d" as Mode, label: "3D Sustav", icon: Box },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange({ mode: id })}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition ${
                    settings.mode === id
                      ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-50"
                      : "border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label>Kolegij</Label>
            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ course: c.id })}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition ${
                    settings.course === c.id
                      ? "border-cyan-400/60 bg-cyan-500/15"
                      : "border-slate-700/60 bg-slate-900/40 hover:border-slate-500"
                  }`}
                >
                  <span className="text-sm text-cyan-50">{c.label}</span>
                  <span className="text-[11px] text-slate-400">{c.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label>Težina</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChange({ difficulty: d.id })}
                  className={`rounded-md border px-2 py-2 text-xs transition ${
                    settings.difficulty === d.id
                      ? "border-amber-400/50 bg-amber-500/15 text-amber-50"
                      : "border-slate-700/60 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          <Button type="button" className="w-full" onClick={onGenerate}>
            <Sparkles className="h-4 w-4" />
            Generiraj novi zadatak
          </Button>

          <Separator />

          <section className="space-y-2">
            <Label>Ugrađeni zadaci</Label>
            <div className="space-y-1.5">
              {catalog
                .filter((t) => t.course === settings.course)
                .map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTask(t.id)}
                    className={`w-full rounded-md border px-2.5 py-2 text-left text-xs transition ${
                      activeId === t.id
                        ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-50"
                        : "border-slate-800 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
