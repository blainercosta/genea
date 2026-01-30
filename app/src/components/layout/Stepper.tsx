"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  completed?: boolean;
  active?: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 md:gap-4 py-4 px-6 md:px-12", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2 md:gap-4">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-xs md:text-sm font-medium",
                step.completed && "bg-genea-green text-white",
                step.active && !step.completed && "bg-genea-green text-white",
                !step.active && !step.completed && "bg-ih-border text-ih-text-muted"
              )}
            >
              {step.completed ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "text-xs md:text-sm",
                (step.active || step.completed) ? "text-ih-text" : "text-ih-text-muted"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-6 md:w-16 h-0.5 rounded-full",
                step.completed ? "bg-genea-green" : "bg-ih-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
