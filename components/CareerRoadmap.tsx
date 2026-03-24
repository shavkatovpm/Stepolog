"use client";

import { useState } from "react";
import type { RoadmapStep } from "@/lib/careers";

export default function CareerRoadmap({ steps }: { steps: RoadmapStep[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Roadmap line */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.level} className="flex flex-1 items-center">
            <button
              onClick={() => setActive(i)}
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                i === active
                  ? "border-brand bg-brand text-black scale-110"
                  : i < active
                    ? "border-brand bg-brand/20 text-brand"
                    : "border-border bg-surface text-muted"
              }`}
            >
              {i + 1}
            </button>
            {i < steps.length - 1 && (
              <div
                className={`h-[2px] w-full transition-colors ${
                  i < active ? "bg-brand" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="mt-2 flex">
        {steps.map((step, i) => (
          <button
            key={step.level}
            onClick={() => setActive(i)}
            className={`flex-1 text-center text-[11px] font-bold uppercase tracking-wider transition-colors ${
              i === active ? "text-brand" : "text-muted"
            }`}
          >
            {step.level}
          </button>
        ))}
      </div>

      {/* Active step detail */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-6 transition-all">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="font-display text-xl uppercase tracking-wide">
            {steps[active].title}
          </h4>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
            {steps[active].duration}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted">Oylik maosh:</span>
          <span className="text-sm font-bold text-green-500">{steps[active].salary}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {steps[active].skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-strong"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
