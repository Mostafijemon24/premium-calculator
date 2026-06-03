import { Calculator, Clock, Delete, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCalculator } from "@/hooks/useCalculator";
import { cn } from "@/lib/utils";
import type { Operator } from "@/lib/calculator";

const OP_CLASS =
  "bg-[oklch(0.488_0.243_264.376/0.25)] text-[oklch(0.696_0.17_283)] font-semibold rounded-2xl text-2xl leading-8 h-16";
const CLEAR_CLASS =
  "bg-[oklch(0.704_0.191_22.216/0.15)] font-semibold rounded-2xl text-[#ff6467] text-lg leading-7 h-16";
const NUM_CLASS =
  "font-medium rounded-2xl bg-neutral-800 text-neutral-50 text-xl leading-7 h-16";
const PERCENT_CLASS =
  "bg-[oklch(0.769_0.188_70.08/0.15)] text-[oklch(0.769_0.188_70.08)] font-semibold rounded-2xl text-lg leading-7 h-16";

function displayTextSize(value: string): string {
  const len = value.replace(/,/g, "").length;
  if (len > 12) return "text-3xl leading-9";
  if (len > 9) return "text-4xl leading-10";
  if (len > 6) return "text-5xl leading-12";
  return "text-6xl leading-14";
}

type CalcButtonProps = {
  label: React.ReactNode;
  className?: string;
  onClick: () => void;
  ariaLabel?: string;
};

function CalcButton({ label, className, onClick, ariaLabel }: CalcButtonProps) {
  return (
    <Button
      type="button"
      variant="default"
      className={cn("border-0 shadow-none", className)}
      onClick={onClick}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
    >
      {label}
    </Button>
  );
}

export default function App() {
  const calc = useCalculator();

  const onOperator = (op: Operator) => () => calc.chooseOperator(op);

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-[100dvh] w-full max-w-lg mx-auto overflow-hidden">
      <div className="min-h-[100dvh] flex px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] flex-col gap-6">
        <header className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-neutral-200 text-neutral-900 flex justify-center items-center shadow-lg shadow-white/5">
              <Calculator className="size-5" aria-hidden />
            </div>
            <span className="font-semibold text-base leading-6 tracking-tight">
              Calculator
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-9 rounded-full text-[#a1a1a1]",
                calc.showHistory && "bg-white/10 text-neutral-50",
              )}
              onClick={() => calc.setShowHistory(true)}
              aria-label="History"
            >
              <History className="size-4" />
            </Button>
          </div>
        </header>

        <Card className="shadow-2xl rounded-3xl bg-neutral-900 border-white/10 border border-solid p-5 sm:p-6 gap-6 flex-1 flex flex-col">
          <CardContent className="flex p-0 flex-col gap-5 flex-1">
            <div
              className="min-h-[140px] sm:min-h-[160px] rounded-2xl bg-neutral-800 flex p-5 sm:p-6 flex-col justify-end items-end gap-2 overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              {calc.expression ? (
                <span className="tabular-nums font-medium text-[#a1a1a1] text-sm leading-5 truncate max-w-full text-right">
                  {calc.expression}
                </span>
              ) : (
                <span className="tabular-nums font-medium text-[#a1a1a1]/40 text-sm leading-5">
                  &nbsp;
                </span>
              )}
              <span
                className={cn(
                  "tabular-nums font-semibold text-neutral-50 tracking-tight truncate max-w-full text-right transition-[font-size] duration-150",
                  displayTextSize(calc.display),
                  calc.display === "Error" && "text-[#ff6467]",
                )}
              >
                {calc.display}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-auto">
              <CalcButton label="AC" className={CLEAR_CLASS} onClick={calc.clearAll} />
              <CalcButton
                label={<Delete className="size-5" />}
                className={CLEAR_CLASS}
                onClick={calc.backspace}
                ariaLabel="Delete"
              />
              <CalcButton label="%" className={PERCENT_CLASS} onClick={calc.percent} />
              <CalcButton label="÷" className={OP_CLASS} onClick={onOperator("÷")} />

              {(["7", "8", "9"] as const).map((d) => (
                <CalcButton
                  key={d}
                  label={d}
                  className={NUM_CLASS}
                  onClick={() => calc.inputDigit(d)}
                />
              ))}
              <CalcButton label="×" className={OP_CLASS} onClick={onOperator("×")} />

              {(["4", "5", "6"] as const).map((d) => (
                <CalcButton
                  key={d}
                  label={d}
                  className={NUM_CLASS}
                  onClick={() => calc.inputDigit(d)}
                />
              ))}
              <CalcButton label="−" className={OP_CLASS} onClick={onOperator("-")} />

              {(["1", "2", "3"] as const).map((d) => (
                <CalcButton
                  key={d}
                  label={d}
                  className={NUM_CLASS}
                  onClick={() => calc.inputDigit(d)}
                />
              ))}
              <CalcButton label="+" className={OP_CLASS} onClick={onOperator("+")} />

              <CalcButton
                label="0"
                className={cn(NUM_CLASS, "col-span-2")}
                onClick={() => calc.inputDigit("0")}
              />
              <CalcButton label="." className={NUM_CLASS} onClick={calc.inputDecimal} />
              <CalcButton
                label="="
                className="font-bold rounded-2xl bg-neutral-200 text-neutral-900 text-2xl leading-8 h-16"
                onClick={calc.equals}
              />
            </div>
          </CardContent>
        </Card>

        <p className="text-[#a1a1a1] text-xs leading-4 flex justify-center items-center gap-2 shrink-0">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <span>ইতিহাস দেখতে History আইকনে ট্যাপ করুন</span>
        </p>
      </div>

      {calc.showHistory && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Calculation history"
          onClick={() => calc.setShowHistory(false)}
        >
          <div
            className="bg-neutral-900 rounded-t-3xl border-t border-white/10 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[70dvh] flex flex-col gap-4 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg tracking-tight">History</h2>
              <div className="flex gap-1">
                {calc.history.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[#ff6467] text-sm h-9 px-3 rounded-full"
                    onClick={calc.clearHistory}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-[#a1a1a1]"
                  onClick={() => calc.setShowHistory(false)}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <ul className="overflow-y-auto flex flex-col gap-2 -mx-1 px-1">
              {calc.history.length === 0 ? (
                <li className="text-[#a1a1a1] text-sm py-8 text-center">
                  এখনও কোনো হিসাব নেই
                </li>
              ) : (
                calc.history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className="w-full text-left rounded-2xl bg-neutral-800 hover:bg-neutral-700/80 active:scale-[0.99] transition-all p-4 flex flex-col gap-1"
                      onClick={() => calc.selectFromHistory(entry)}
                    >
                      <span className="text-[#a1a1a1] text-sm tabular-nums">
                        {entry.expression}
                      </span>
                      <span className="text-neutral-50 font-semibold text-xl tabular-nums">
                        = {entry.result}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
