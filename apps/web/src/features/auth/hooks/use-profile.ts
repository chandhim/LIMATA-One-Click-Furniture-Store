"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile, uploadAvatar, getProfile } from "../api/auth";
import { useAuthStore } from "../store/use-auth-store";
import type { AuthUser } from "../types/auth.types";

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    // Only fetch once the store is hydrated and user is logged in
    enabled: isHydrated && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUserStore = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (values: Partial<AuthUser>) => updateProfile(values),
    onSuccess: (updatedUser) => {
      updateUserStore(updatedUser);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const updateUserStore = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: async () => {
      // Invalidate and then re-fetch to get the full updated user object
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      try {
        const updatedUser = await getProfile();
        updateUserStore(updatedUser);
      } catch (error) {
        console.error("Failed to sync updated user after avatar upload", error);
      }
    },
  });
}
