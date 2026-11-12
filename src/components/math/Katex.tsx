
import katex from "katex";
import { useMemo } from "react";
import "katex/dist/katex.min.css";

export function Katex({
  expr,
  display = false,
  className,
}: {
  expr: string;
  display?: boolean;
  className?: string;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: display,
        strict: "ignore",
      });
    } catch {
      return expr;
    }
  }, [expr, display]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
