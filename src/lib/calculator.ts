export type Operator = "+" | "-" | "×" | "÷";

export const OPERATORS: Operator[] = ["+", "-", "×", "÷"];

export function applyOperation(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

export function parseDisplay(value: string): number {
  const normalized = value.replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatNumber(
  value: number,
  options?: { maxFractionDigits?: number },
): string {
  if (!Number.isFinite(value)) return "Error";

  const maxFractionDigits = options?.maxFractionDigits ?? 10;
  const rounded = Number.parseFloat(value.toPrecision(12));

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
    useGrouping: true,
  }).format(rounded);
}

export function formatDisplayString(raw: string): string {
  if (!raw || raw === "Error") return raw || "0";
  if (raw.endsWith(".")) {
    const base = raw.slice(0, -1);
    if (!base) return "0.";
    const formatted = formatNumber(parseDisplay(base), { maxFractionDigits: 10 });
    return `${formatted}.`;
  }
  const parsed = parseDisplay(raw);
  if (!Number.isFinite(parsed)) return "Error";
  return formatNumber(parsed, { maxFractionDigits: 10 });
}

export function buildExpressionPreview(
  left: string,
  op: Operator | null,
  right: string | null,
): string {
  if (!op) return "";
  const leftFmt = formatDisplayString(left);
  if (!right) return `${leftFmt} ${op}`;
  return `${leftFmt} ${op} ${formatDisplayString(right)}`;
}
