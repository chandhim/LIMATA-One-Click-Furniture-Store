"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (newValue: number) => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const canDecrement = value > min && !disabled;
  const canIncrement = value < max && !disabled;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-md)",
        padding: "0.2rem",
        height: "40px",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <button
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        aria-label="Decrease quantity"
        style={{
          background: "none",
          border: "none",
          cursor: canDecrement ? "pointer" : "not-allowed",
          padding: "0.375rem 0.625rem",
          color: "var(--fg-primary)",
          opacity: canDecrement ? 0.8 : 0.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          borderRadius: "var(--radius-sm)",
          transition: "opacity 0.15s ease",
        }}
      >
        <Minus size={13} />
      </button>

      <span
        style={{
          minWidth: "2rem",
          textAlign: "center",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "var(--fg-primary)",
          userSelect: "none",
        }}
      >
        {value}
      </span>

      <button
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        aria-label="Increase quantity"
        style={{
          background: "none",
          border: "none",
          cursor: canIncrement ? "pointer" : "not-allowed",
          padding: "0.375rem 0.625rem",
          color: "var(--fg-primary)",
          opacity: canIncrement ? 0.8 : 0.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          borderRadius: "var(--radius-sm)",
          transition: "opacity 0.15s ease",
        }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
