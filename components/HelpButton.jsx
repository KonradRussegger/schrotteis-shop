"use client";

import { useState } from "react";
import { ADMIN_HELP } from "@/lib/adminHelp";

export default function HelpButton({ topic }) {
  const [open, setOpen] = useState(false);
  const help = ADMIN_HELP[topic];

  if (!help) return null;

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs text-muted hover:text-tanLight border border-line rounded-sm px-3 py-1.5"
      >
        {open ? "✕ Hilfe ausblenden" : "? Hilfe"}
      </button>

      {open && (
        <div className="mt-3 p-5 rounded-sm bg-card border border-line max-w-[600px]">
          <p className="font-display text-base font-medium mb-3">{help.title}</p>
          <div className="space-y-3">
            {help.sections.map((s, i) => (
              <div key={i}>
                {s.heading && (
                  <p className="font-mono text-[11px] text-muted mb-1 tracking-wide">{s.heading}</p>
                )}
                <p className="text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
