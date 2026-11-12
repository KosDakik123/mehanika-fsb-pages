
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Katex } from "@/components/math/Katex";
import type { MechTask } from "@/lib/types";
import { Bot, Calculator, Lightbulb } from "lucide-react";

interface SolutionPanelProps {
  task: MechTask;
  aiNote?: string | null;
  solving?: boolean;
}

export function SolutionPanel({ task, aiNote, solving }: SolutionPanelProps) {
  const { solution } = task;

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-cyan-900/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-cyan-300" />
          <h2 className="font-[family-name:var(--font-display)] text-lg text-cyan-50">
            Korak-po-korak rješenje
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {solution.styleNote ?? "FSB notacija · ΣF = 0, ΣM = 0"}
        </p>
        {aiNote && (
          <div className="mt-2 flex items-start gap-2 rounded border border-amber-700/40 bg-amber-950/30 px-2 py-1.5 text-xs text-amber-100">
            <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{aiNote}</span>
          </div>
        )}
        {solving && (
          <p className="mt-2 animate-pulse text-xs text-cyan-300">
            Analiziram zadatak…
          </p>
        )}
      </header>

      <ScrollArea className="flex-1 px-4 py-3">
        <p className="text-sm leading-relaxed text-slate-200">{solution.summary}</p>

        <section className="mt-5">
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/90">
            <Lightbulb className="h-3.5 w-3.5" />
            Sile — smjer i zašto
          </h3>
          <div className="space-y-2">
            {solution.forces.map((f) => (
              <div
                key={f.id}
                className="rounded-md border border-slate-700/60 bg-slate-900/50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{f.label}</Badge>
                  <span className="text-xs text-slate-400">{f.application}</span>
                </div>
                <p className="mt-1.5 text-sm text-cyan-100">
                  <span className="text-slate-400">Smjer: </span>
                  {f.direction}
                </p>
                <p className="mt-1 text-sm text-slate-300">{f.why}</p>
                {f.components && (
                  <p className="mt-1 font-mono text-xs text-amber-200/90">
                    Komponente: {f.components}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-5" />

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/90">
            Jednadžbe ravnoteže
          </h3>
          <div className="space-y-2 rounded-md border border-cyan-900/40 bg-[#061018] p-3">
            {solution.equations.map((eq, i) => (
              <div key={i} className="overflow-x-auto text-sm text-cyan-50">
                <Katex expr={eq} display />
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-5" />

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/90">
            Postupak
          </h3>
          {solution.steps.map((step, i) => (
            <article
              key={i}
              className="relative rounded-md border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950/40 p-3 pl-4"
            >
              <div className="absolute bottom-3 left-0 top-3 w-0.5 rounded bg-cyan-500/70" />
              <h4 className="font-[family-name:var(--font-display)] text-base text-cyan-50">
                {step.title}
              </h4>
              <p className="mt-1 text-sm text-slate-300">{step.body}</p>
              {step.latex?.map((lx, j) => (
                <div key={j} className="mt-2 overflow-x-auto text-sm">
                  <Katex expr={lx} display />
                </div>
              ))}
              {step.note && (
                <p className="mt-2 rounded border border-amber-800/40 bg-amber-950/20 px-2 py-1.5 text-xs text-amber-100/90">
                  {step.note}
                </p>
              )}
            </article>
          ))}
        </section>

        <Separator className="my-5" />

        <section className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/90">
            Rezultati
          </h3>
          <div className="overflow-hidden rounded-md border border-cyan-800/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-cyan-950/50 text-xs uppercase tracking-wider text-cyan-300/80">
                <tr>
                  <th className="px-3 py-2">Simbol</th>
                  <th className="px-3 py-2">Vrijednost</th>
                  <th className="px-3 py-2">Značenje</th>
                </tr>
              </thead>
              <tbody>
                {solution.results.map((r) => (
                  <tr key={r.symbol} className="border-t border-slate-800/80">
                    <td className="px-3 py-2 font-mono text-cyan-200">{r.symbol}</td>
                    <td className="px-3 py-2 text-cyan-50">{r.value}</td>
                    <td className="px-3 py-2 text-slate-400">{r.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollArea>
    </div>
  );
}
