import { useCallback, useMemo, useState } from "react";
import {
  applyOperation,
  buildExpressionPreview,
  formatDisplayString,
  formatNumber,
  parseDisplay,
  type Operator,
} from "@/lib/calculator";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

const HISTORY_KEY = "premium-calculator-history";
const MAX_HISTORY = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [pendingOp, setPendingOp] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);

  const expression = useMemo(() => {
    if (!pendingOp || !storedValue) return "";
    const right = overwrite ? null : display;
    return buildExpressionPreview(storedValue, pendingOp, right);
  }, [display, overwrite, pendingOp, storedValue]);

  const formattedDisplay = useMemo(() => formatDisplayString(display), [display]);

  const pushHistory = useCallback((expr: string, result: string) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      expression: expr,
      result,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      setDisplay((prev) => {
        const raw = overwrite ? "" : prev.replace(/,/g, "");
        if (overwrite) return digit;
        if (raw === "0") return digit;
        if (raw.length >= 15) return prev;
        return raw + digit;
      });
      setOverwrite(false);
    },
    [overwrite],
  );

  const inputDecimal = useCallback(() => {
    setDisplay((prev) => {
      const raw = overwrite ? "" : prev.replace(/,/g, "");
      if (overwrite) return "0.";
      if (raw.includes(".")) return prev;
      return raw ? `${raw}.` : "0.";
    });
    setOverwrite(false);
  }, [overwrite]);

  const backspace = useCallback(() => {
    setOverwrite(false);
    setDisplay((prev) => {
      const raw = prev.replace(/,/g, "");
      if (raw.length <= 1 || (raw.length === 2 && raw.startsWith("-"))) return "0";
      const next = raw.slice(0, -1);
      return next === "-" ? "0" : next;
    });
  }, []);

  const percent = useCallback(() => {
    setOverwrite(true);
    setDisplay((prev) => {
      const value = parseDisplay(prev) / 100;
      return formatNumber(value, { maxFractionDigits: 10 }).replace(/,/g, "");
    });
  }, []);

  const chooseOperator = useCallback(
    (op: Operator) => {
      const current = parseDisplay(display);

      if (storedValue !== null && pendingOp && !overwrite) {
        const left = parseDisplay(storedValue);
        const result = applyOperation(left, current, pendingOp);
        if (!Number.isFinite(result)) {
          setDisplay("Error");
          setStoredValue(null);
          setPendingOp(null);
          setOverwrite(true);
          return;
        }
        const resultStr = formatNumber(result, { maxFractionDigits: 10 }).replace(
          /,/g,
          "",
        );
        setDisplay(resultStr);
        setStoredValue(resultStr);
      } else if (storedValue === null) {
        setStoredValue(display.replace(/,/g, ""));
      } else {
        setStoredValue(display.replace(/,/g, ""));
      }

      setPendingOp(op);
      setOverwrite(true);
    },
    [display, overwrite, pendingOp, storedValue],
  );

  const equals = useCallback(() => {
    if (!pendingOp || storedValue === null) return;

    const left = parseDisplay(storedValue);
    const right = parseDisplay(display);
    const result = applyOperation(left, right, pendingOp);

    const expr = buildExpressionPreview(storedValue, pendingOp, display);
    if (!Number.isFinite(result)) {
      setDisplay("Error");
      setStoredValue(null);
      setPendingOp(null);
      setOverwrite(true);
      return;
    }

    const resultStr = formatNumber(result, { maxFractionDigits: 10 }).replace(/,/g, "");
    pushHistory(expr, formatDisplayString(resultStr));
    setDisplay(resultStr);
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
  }, [display, pendingOp, pushHistory, storedValue]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const selectFromHistory = useCallback((entry: HistoryEntry) => {
    const raw = entry.result.replace(/,/g, "");
    setDisplay(raw);
    setStoredValue(null);
    setPendingOp(null);
    setOverwrite(true);
    setShowHistory(false);
  }, []);

  return {
    display: formattedDisplay,
    expression,
    rawDisplay: display,
    history,
    showHistory,
    setShowHistory,
    clearHistory,
    selectFromHistory,
    clearAll,
    inputDigit,
    inputDecimal,
    backspace,
    percent,
    chooseOperator,
    equals,
  };
}
