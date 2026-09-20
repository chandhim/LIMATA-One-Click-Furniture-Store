"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDeliveryRates, updateDeliveryRates, DeliveryConfiguration } from "@/features/orders/services/delivery.service";
import { DELIVERY_RATES_QUERY_KEY } from "@/features/orders/hooks/use-delivery-rates";

export default function AdminDeliveryPage() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<DeliveryConfiguration[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const { data: serverConfigs, isLoading } = useQuery({
    queryKey: DELIVERY_RATES_QUERY_KEY,
    queryFn: fetchDeliveryRates,
  });

  useEffect(() => {
    if (serverConfigs) {
      setConfigs(serverConfigs);
    }
  }, [serverConfigs, isEditing]);

  const updateMutation = useMutation({
    mutationFn: updateDeliveryRates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DELIVERY_RATES_QUERY_KEY });
      setIsEditing(false);
      alert("Delivery configurations updated successfully!");
    },
    onError: (err: Error) => {
      alert("Failed to update configurations: " + (err.message || "Unknown error"));
    },
  });

  const handleChange = (index: number, field: keyof DeliveryConfiguration, value: number) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], [field]: value };
    setConfigs(updated);
  };

  const handleSave = () => {
    updateMutation.mutate(configs);
  };

  if (isLoading) {
    return (
      <div>
        <div>Loading delivery configurations...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--fg-primary)" }}>Delivery Pricing Configuration</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: "var(--accent-dark)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit Rates
            </button>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setConfigs(serverConfigs || []);
                }}
                style={{
                  background: "transparent",
                  color: "var(--fg-primary)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                style={{
                  background: "var(--accent-dark)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {configs.map((config, index) => (
            <div key={config.method} style={{ background: "var(--bg-surface)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1rem" }}>
                {config.method === "STANDARD" ? "Standard Delivery" : "Fast Courier"}
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Order Subtotal Threshold (Rs.)</label>
                  <input
                    type="number"
                    value={config.thresholdAmount}
                    onChange={(e) => handleChange(index, "thresholdAmount", Number(e.target.value))}
                    disabled={!isEditing}
                    style={{
                      width: "100%", padding: "0.5rem", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)", background: isEditing ? "transparent" : "var(--bg-base)"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>
                    If order subtotal is below this amount, the &quot;Below Threshold&quot; fee applies. Otherwise, the &quot;Above Threshold&quot; fee applies.
                  </p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Fee: Below Threshold (Rs.)</label>
                    <input
                      type="number"
                      value={config.belowThresholdCharge}
                      onChange={(e) => handleChange(index, "belowThresholdCharge", Number(e.target.value))}
                      disabled={!isEditing}
                      style={{
                        width: "100%", padding: "0.5rem", borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)", background: isEditing ? "transparent" : "var(--bg-base)"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Fee: Above/Equal Threshold (Rs.)</label>
                    <input
                      type="number"
                      value={config.aboveThresholdCharge}
                      onChange={(e) => handleChange(index, "aboveThresholdCharge", Number(e.target.value))}
                      disabled={!isEditing}
                      style={{
                        width: "100%", padding: "0.5rem", borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)", background: isEditing ? "transparent" : "var(--bg-base)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
