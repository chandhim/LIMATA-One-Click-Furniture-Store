"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateUserRole, useToggleUserStatus } from "@/features/admin/hooks/use-admin";
import { Search, Shield, Calendar, UserCheck, UserX } from "lucide-react";

interface AdminUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive?: boolean;
}

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading } = useAdminUsers(searchTerm);
  const updateUserRoleMutation = useUpdateUserRole();
  const toggleUserStatusMutation = useToggleUserStatus();

  async function handleRoleChange(userId: string, role: string) {
    try {
      await updateUserRoleMutation.mutateAsync({ userId, role });
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  }

  async function handleStatusToggle(userId: string, currentStatus: boolean) {
    const actionLabel = currentStatus ? "disable" : "enable";
    if (confirm(`Are you sure you want to ${actionLabel} this user's account?`)) {
      try {
        await toggleUserStatusMutation.mutateAsync({ userId, isActive: !currentStatus });
      } catch (err) {
        console.error("Failed to toggle user status:", err);
      }
    }
  }

  if (isLoading) {
    return (
      <div 
        style={{ 
          padding: "4rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "80vh", 
          color: "var(--fg-muted)", 
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <span>Loading customers...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", padding: "1.5rem 2rem", maxWidth: 1400, margin: "0 auto", background: "var(--bg-base)", overflow: "hidden" }}>
      


      {/* Filter / Search Row */}
      <div style={{ marginBottom: "1.75rem", position: "relative", maxWidth: 500, width: "100%" }}>
        <Search 
          size={16} 
          style={{ 
            position: "absolute", 
            left: "1rem", 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "var(--fg-muted)" 
          }} 
        />
        <input
          type="text"
          placeholder="Search users by name or email address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-base"
          style={{ paddingLeft: "2.75rem", fontSize: "0.875rem" }}
        />
      </div>

      {/* Users Table */}
      <div 
        style={{ 
          background: "var(--bg-surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--radius-lg)", 
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0
        }}
      >
        <div style={{ overflow: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--bg-elevated)", boxShadow: "0 1px 0 var(--border)" }}>
              <tr>
                {["Name", "Email Address", "Privilege Role", "Registered On", "Account Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "5rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((item: AdminUser, idx: number) => {
                  const registeredDate = new Date(item.createdAt).toLocaleDateString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  const isActive = item.isActive !== false;
                  const initials = item.name?.[0]?.toUpperCase() ?? "U";

                  return (
                    <tr
                      key={item.userId}
                      style={{ borderBottom: idx < users.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,249,247,0.4)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {/* Name */}
                      <td style={{ padding: "1.125rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: item.role === "ADMIN" ? "rgba(201,169,110,0.12)" : "var(--bg-elevated)",
                              border: `1px solid ${item.role === "ADMIN" ? "rgba(201,169,110,0.25)" : "var(--border)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: item.role === "ADMIN" ? "var(--accent-dark)" : "var(--fg-secondary)",
                              flexShrink: 0
                            }}
                          >
                            {initials}
                          </div>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "1.125rem 1.5rem", fontSize: "0.85rem", color: "var(--fg-secondary)" }}>
                        {item.email}
                      </td>

                      {/* Role Dropdown */}
                      <td style={{ padding: "1.125rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Shield size={13} style={{ color: item.role === "ADMIN" ? "var(--accent)" : "var(--fg-muted)" }} />
                          <select
                            value={item.role}
                            onChange={(e) => handleRoleChange(item.userId, e.target.value)}
                            className="input-base"
                            style={{ 
                              padding: "0.375rem 1.5rem 0.375rem 0.5rem", 
                              fontSize: "0.78rem", 
                              fontWeight: 600,
                              minWidth: 120,
                              background: "var(--bg-surface)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)"
                            }}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td style={{ padding: "1.125rem 1.5rem", fontSize: "0.825rem", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                          <Calendar size={13} style={{ color: "var(--fg-muted)" }} />
                          <span>{registeredDate}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "1.125rem 1.5rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.625rem",
                            borderRadius: "var(--radius-full)",
                            background: isActive ? "rgba(74,166,120,0.12)" : "rgba(220,80,80,0.08)",
                            color: isActive ? "#276e47" : "#c0392b",
                            border: `1px solid ${isActive ? "rgba(74,166,120,0.2)" : "rgba(220,80,80,0.15)"}`
                          }}
                        >
                          {isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* Toggle Button Actions */}
                      <td style={{ padding: "1.125rem 1.5rem" }}>
                        <button
                          onClick={() => handleStatusToggle(item.userId, isActive)}
                          style={{
                            padding: "0.4rem 1rem",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: isActive ? "rgba(220,80,80,0.85)" : "#276e47",
                            background: isActive ? "rgba(220,80,80,0.05)" : "rgba(74,166,120,0.08)",
                            border: `1px solid ${isActive ? "rgba(220,80,80,0.18)" : "rgba(74,166,120,0.2)"}`,
                            borderRadius: "var(--radius-full)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            if (isActive) {
                              el.style.background = "rgba(220,80,80,0.12)";
                              el.style.color = "#c0392b";
                              el.style.borderColor = "rgba(220,80,80,0.25)";
                            } else {
                              el.style.background = "rgba(74,166,120,0.15)";
                              el.style.color = "#1b5e39";
                              el.style.borderColor = "rgba(74,166,120,0.3)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = isActive ? "rgba(220,80,80,0.05)" : "rgba(74,166,120,0.08)";
                            el.style.color = isActive ? "rgba(220,80,80,0.85)" : "#276e47";
                            el.style.borderColor = isActive ? "rgba(220,80,80,0.18)" : "rgba(74,166,120,0.2)";
                          }}
                        >
                          {isActive ? (
                            <>
                              <UserX size={12} />
                              <span>Disable Access</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} />
                              <span>Enable Access</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
