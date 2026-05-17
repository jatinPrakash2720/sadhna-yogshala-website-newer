"use client";

import { useEffect, useMemo, useState } from "react";

function getParts(target: string | Date) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimer({ target }: { target: string | Date }) {
  const [parts, setParts] = useState(() => getParts(target));
  const labels = useMemo(() => ["days", "hours", "minutes", "seconds"] as const, []);

  useEffect(() => {
    const timer = window.setInterval(() => setParts(getParts(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {labels.map((label) => (
        <div key={label} className="rounded-lg bg-white/90 px-2 py-3 text-center shadow-sm ring-1 ring-cream-200">
          <p className="text-lg font-bold text-brand-800 tabular-nums">{String(parts[label]).padStart(2, "0")}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sage-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
