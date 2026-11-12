export type Course = "mehanika1" | "mehanika2" | "mdt";
export type Mode = "2d" | "3d";
export type Difficulty = "lako" | "srednje" | "ispitni";

export type SupportKind =
  | "pin"
  | "roller"
  | "fixed"
  | "hinge"
  | "clamp"
  | "cable"
  | "rod";

export type ElementKind =
  | "beam"
  | "frame"
  | "truss"
  | "rod"
  | "cable"
  | "member";

export interface Point2 {
  x: number;
  y: number;
}

export interface SketchLabel {
  text: string;
  at: Point2;
  kind?: "dim" | "point" | "note";
}

export interface SketchForce {
  id: string;
  at: Point2;
  /** angle in degrees from +x, CCW; SVG y grows down so drawing flips */
  angleDeg: number;
  magnitude: number;
  unit: string;
  label: string;
  color?: string;
  kind?: "force" | "moment" | "distributed";
  /** for distributed: length along beam */
  length?: number;
  sense?: "cw" | "ccw";
}

export interface SketchSupport {
  id: string;
  kind: SupportKind;
  at: Point2;
  orientationDeg?: number;
  label?: string;
}

export interface SketchElement {
  id: string;
  kind: ElementKind;
  points: Point2[];
  label?: string;
  dashed?: boolean;
}

export interface DiagramSample {
  /** station along beam in m */
  x: number;
  N?: number;
  T?: number;
  M?: number;
}

export interface InternalDiagrams {
  stations: DiagramSample[];
  /** scale hints for drawing */
  maxN?: number;
  maxT?: number;
  maxM?: number;
}

export interface ForceExplanation {
  id: string;
  label: string;
  direction: string;
  application: string;
  why: string;
  components?: string;
}

export interface SolutionStep {
  title: string;
  body: string;
  latex?: string[];
  note?: string;
}

export interface TaskSolution {
  summary: string;
  forces: ForceExplanation[];
  equations: string[];
  steps: SolutionStep[];
  results: { symbol: string; value: string; meaning: string }[];
  styleNote?: string;
}

export interface MechTask {
  id: string;
  title: string;
  course: Course;
  mode: Mode;
  difficulty: Difficulty;
  statement: string;
  given: string[];
  sketch: {
    elements: SketchElement[];
    supports: SketchSupport[];
    forces: SketchForce[];
    labels: SketchLabel[];
    viewBox?: string;
    diagrams?: InternalDiagrams;
  };
  solution: TaskSolution;
  tags?: string[];
}

export interface AppSettings {
  mode: Mode;
  course: Course;
  difficulty: Difficulty;
  imageName?: string;
  pdfName?: string;
  styleHint?: string;
}
