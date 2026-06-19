"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuthBootstrap, useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/features/auth/hooks/use-profile";
import { Camera, Trash2, Edit2, User, MapPin, Mail, Shield, Check, X } from "lucide-react";

// Default export wraps content in Suspense so useSearchParams doesn't
// cause a "Missing Suspense boundary" error in Next.js 15 App Router.
export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  useAuthBootstrap();
  const { isHydrated, isAuthenticated } = useAuthGuard();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    province: "",
    postalCode: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile data to state when loaded or edit state is toggled
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        city: profile.city || "",
        district: profile.district || "",
        province: profile.province || "",
        postalCode: profile.postalCode || "",
      });
    }
  }, [profile]);

  // Handle URL query ?edit=true to trigger edit mode
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
      // Clean query parameter after reading
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  if (!isHydrated || isProfileLoading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "var(--bg-base)" }}>
          <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)", animation: "pulse 1.5s infinite" }}>Loading your profile...</div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !profile) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth || "",
        addressLine1: profile.addressLine1 || "",
        addressLine2: profile.addressLine2 || "",
        city: profile.city || "",
        district: profile.district || "",
        province: profile.province || "",
        postalCode: profile.postalCode || "",
      });
    }
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        await uploadAvatarMutation.mutateAsync(file);
      } catch (err) {
        alert("Failed to upload photo: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (confirm("Are you sure you want to remove your profile photo?")) {
      try {
        await updateProfileMutation.mutateAsync({ avatarUrl: null });
      } catch (err) {
        alert("Failed to remove photo: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <MainLayout>
      <div style={{ background: "var(--bg-base)", minHeight: "100vh", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }}>
            <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2.5rem", alignItems: "start" }}>
              
              {/* Left Column: Avatar & Quick Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Profile Card */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2.5rem 2rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                  
                  {/* Avatar wrapper */}
                  <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 1.5rem" }}>
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2.5rem",
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {profile.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    
                    {/* Camera Button (upload overlay) */}
                    <button
                      onClick={triggerFileInput}
                      disabled={uploadAvatarMutation.isPending}
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        background: "var(--accent-dark)",
                        color: "white",
                        border: "none",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                        transition: "transform 0.2s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      title="Upload New Photo"
                    >
                      <Camera size={14} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>

                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>{profile.name}</h2>
                  <p style={{ color: "var(--fg-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{profile.email}</p>

                  <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                    <button
                      onClick={triggerFileInput}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "rgba(201,169,110,0.1)",
                        border: "1px solid var(--accent)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--accent-dark)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {profile.avatarUrl ? "Replace" : "Upload"}
                    </button>
                    {profile.avatarUrl && (
                      <button
                        onClick={handleRemovePhoto}
                        style={{
                          padding: "0.5rem",
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "var(--radius-md)",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Remove Photo"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Account Type Panel */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Shield size={16} style={{ color: "var(--accent-dark)" }} />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", textTransform: "uppercase", display: "block" }}>Role Access</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>{profile.role}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Mail size={16} style={{ color: "var(--accent-dark)" }} />
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", textTransform: "uppercase", display: "block" }}>Login Email</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", wordBreak: "break-all" }}>{profile.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Detail Forms */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2.5rem 2.5rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem", marginBottom: "2rem" }}>
                  <div>
                    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 700, color: "var(--fg-primary)" }}>Customer Profile</h1>
                    <p style={{ color: "var(--fg-muted)", fontSize: "0.875rem", margin: 0 }}>Configure personal details and delivery addresses.</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        padding: "0.6rem 1.1rem",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--fg-primary)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSave}>
                  {/* Section 1: Personal Details */}
                  <div style={{ marginBottom: "2.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <User size={16} style={{ color: "var(--accent-dark)" }} />
                      Personal Information
                    </h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. John"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. Doe"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1.25rem" }} className="form-grid">
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. +94 77 123 4567"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Date of Birth (Optional)</label>
                        <input
                          type="text"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="YYYY-MM-DD"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Address Details */}
                  <div style={{ marginBottom: "2.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <MapPin size={16} style={{ color: "var(--accent-dark)" }} />
                      Address Details
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Address Line 1</label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Street address, P.O. Box"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Apartment, suite, unit, building"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            background: isEditing ? "transparent" : "var(--bg-elevated)",
                            color: "var(--fg-primary)",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                        <div>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. Colombo"
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "1.5px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              background: isEditing ? "transparent" : "var(--bg-elevated)",
                              color: "var(--fg-primary)",
                              outline: "none"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>District</label>
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. Colombo"
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "1.5px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              background: isEditing ? "transparent" : "var(--bg-elevated)",
                              color: "var(--fg-primary)",
                              outline: "none"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-grid">
                        <div>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Province</label>
                          <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. Western"
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "1.5px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              background: isEditing ? "transparent" : "var(--bg-elevated)",
                              color: "var(--fg-primary)",
                              outline: "none"
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. 00100"
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "1.5px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              background: isEditing ? "transparent" : "var(--bg-elevated)",
                              color: "var(--fg-primary)",
                              outline: "none"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  {isEditing && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={updateProfileMutation.isPending}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "transparent",
                          border: "1.5px solid var(--border)",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                          cursor: "pointer",
                        }}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "var(--accent-dark)",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {updateProfileMutation.isPending ? (
                          "Saving..."
                        ) : (
                          <>
                            <Check size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}