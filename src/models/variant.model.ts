export type VariantId = 'multiplication' | 'addition' | 'subtraction' | 'division';

export interface DifficultyLevel {
  id: string;
  label: string;
  spinnerCount: 1 | 2;
  spinnerMax: number;
  fixedOperand?: number;
  fixedLabel?: string;
  /** Symbol shown between the two dice in dual-spinner mode. Defaults to ×. */
  dualOperator?: string;
  /** Transforms the raw die value into the number shown on the die face (e.g. die×3 for division). */
  die1DisplayTransform?: (val: number) => number;
  computeResult: (die1: number, die2?: number) => number;
  boardValues: () => number[];
  isUpTo12?: boolean;
  isMixed?: boolean;
}

export interface VariantConfig {
  id: VariantId;
  label: string;
  gradeRange: string;
  description: string;
  icon: string;
  difficulties: DifficultyLevel[];
  supportsUpTo12: boolean;
  supportsMixed: boolean;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function uniqueSorted(arr: number[]): number[] {
  return [...new Set(arr)].sort((a, b) => a - b);
}

function multiplicationPool(max: number): number[] {
  const vals: number[] = [];
  for (let i = 1; i <= max; i++) for (let j = 1; j <= max; j++) vals.push(i * j);
  return uniqueSorted(vals);
}

function additionPool(fixedAddend: number, spinnerMax: number): number[] {
  return uniqueSorted(Array.from({ length: spinnerMax }, (_, i) => (i + 1) + fixedAddend));
}

function divisionPool(spinnerMax: number): number[] {
  return Array.from({ length: spinnerMax }, (_, i) => i + 1);
}

// ─── individual fact difficulty builders ──────────────────────────────────

function multIndividual(n: number, max: number): DifficultyLevel {
  return {
    id: `x${n}`,
    label: `× ${n}`,
    spinnerCount: 1,
    spinnerMax: max,
    fixedOperand: n,
    fixedLabel: `× ${n}`,
    computeResult: (d1) => d1 * n,
    boardValues: () => uniqueSorted(Array.from({ length: max }, (_, i) => (i + 1) * n)),
  };
}

function addIndividual(n: number): DifficultyLevel {
  return {
    id: `plus${n}`,
    label: `+ ${n}`,
    spinnerCount: 1,
    spinnerMax: 10,
    fixedOperand: n,
    fixedLabel: `+ ${n}`,
    computeResult: (d1) => d1 + n,
    boardValues: () => additionPool(n, 10),
  };
}

function subIndividual(n: number): DifficultyLevel {
  return {
    id: `minus${n}`,
    label: `− ${n}`,
    spinnerCount: 1,
    spinnerMax: 10,
    fixedOperand: n,
    fixedLabel: `− ${n}`,
    die1DisplayTransform: (val) => val + n,
    computeResult: (d1) => d1,
    boardValues: () => divisionPool(10),
  };
}

function divIndividual(n: number, max: number): DifficultyLevel {
  return {
    id: `div${n}`,
    label: `÷ ${n}`,
    spinnerCount: 1,
    spinnerMax: max,
    fixedOperand: n,
    fixedLabel: `÷ ${n}`,
    die1DisplayTransform: (val) => val * n,
    computeResult: (d1) => d1,
    boardValues: () => divisionPool(max),
  };
}

// ─── Variant configs ─────────────────────────────────────────────────────────

export const VARIANTS: Record<VariantId, VariantConfig> = {

  multiplication: {
    id: 'multiplication',
    label: 'Multiplication',
    gradeRange: 'Grades 3 – 5',
    icon: '×',
    description: 'Spin a number, multiply, and mark a side of that square before someone beats you to it.',
    supportsUpTo12: true,
    supportsMixed: true,
    difficulties: [
      // Base: ×2–×12, spinner 1–10
      ...([2,3,4,5,6,7,8,9,10,11,12].map(n => multIndividual(n, 10))),
      // Up to 12: ×2–×12, spinner 1–12
      ...([2,3,4,5,6,7,8,9,10,11,12].map(n => ({
        ...multIndividual(n, 12),
        id: `x${n}_12`,
        isUpTo12: true as const,
      }))),
      // Mixed: both spinners 1–N
      ...([2,3,4,5,6,7,8,9,10,11,12].map(n => ({
        id: `mixed${n}`,
        label: `Mixed (up to ${n})`,
        spinnerCount: 2 as const,
        spinnerMax: n,
        isMixed: true as const,
        computeResult: (d1: number, d2?: number) => d1 * d2!,
        boardValues: () => multiplicationPool(n),
      }))),
    ],
  },

  addition: {
    id: 'addition',
    label: 'Addition',
    gradeRange: 'Grades 1 – 2',
    icon: '+',
    description: 'Add your spin to find the sum. Claim that square before anyone else draws the last side.',
    supportsUpTo12: false,
    supportsMixed: true,
    difficulties: [
      ...([0,1,2,3,4,5,6,7,8,9,10].map(n => addIndividual(n))),
      { id: 'mixed0_10', label: 'Mixed (sums 1–20)', spinnerCount: 2, spinnerMax: 10, dualOperator: '+', isMixed: true, computeResult: (d1, d2) => d1 + d2!, boardValues: () => uniqueSorted(Array.from({ length: 10 }, (_, i) => i + 1).flatMap(a => Array.from({ length: 10 }, (_, j) => a + (j + 1)))) },
    ],
  },

  subtraction: {
    id: 'subtraction',
    label: 'Subtraction',
    gradeRange: 'Grades 1 – 2',
    icon: '−',
    description: 'Spin the starting number and subtract. Hunt for the answer on the board — and pick your square carefully.',
    supportsUpTo12: false,
    supportsMixed: true,
    difficulties: [
      ...([0,1,2,3,4,5,6,7,8,9,10].map(n => subIndividual(n))),
      { id: 'mixed', label: 'Mixed', spinnerCount: 2, spinnerMax: 10, dualOperator: '−', isMixed: true, computeResult: (d1, d2) => Math.abs(d1 - d2!), boardValues: () => [0, ...divisionPool(10)] },
    ],
  },

  division: {
    id: 'division',
    label: 'Division',
    gradeRange: 'Grades 3 – 4',
    icon: '÷',
    description: 'Divide the spinner to find your quotient. Find it on the board and draw your line.',
    supportsUpTo12: true,
    supportsMixed: false,
    difficulties: [
      // Base: ÷1–÷12, spinner 1–10 (quotients 1–10)
      ...([1,2,3,4,5,6,7,8,9,10,11,12].map(n => divIndividual(n, 10))),
      // Up to 12: ÷1–÷12, spinner 1–12 (quotients 1–12)
      ...([1,2,3,4,5,6,7,8,9,10,11,12].map(n => ({
        ...divIndividual(n, 12),
        id: `div${n}_12`,
        isUpTo12: true as const,
      }))),
    ],
  },
};

export const VARIANT_LIST: VariantConfig[] = Object.values(VARIANTS);

export function getVariant(id: string): VariantConfig {
  const v = VARIANTS[id as VariantId];
  if (!v) throw new Error(`Unknown variant: ${id}`);
  return v;
}
