import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface PersonalData {
  id: string;
  step1_data: any;
  step2_data: any;
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: PersonalData | null;
  loading: boolean;
  error: string | null;
  hasPersonalData: boolean;
}

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useUserProfile = (
  user: User | null
): ProfileState & ProfileActions => {
  const [profile, setProfile] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("personal_data")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, that's okay - user needs to complete signup
        if (error.code === "PGRST116") {
          setProfile(null);
        } else {
          setError(error.message);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Fetch profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
      setError(null);
    }
  }, [user?.id, fetchProfile]);

  // Check if user has personal data
  const hasPersonalData =
    profile?.step2_data && Object.keys(profile.step2_data).length > 0;

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("useUserProfile: User ID:", user.id);
      console.log("useUserProfile: Profile:", profile);
      console.log("useUserProfile: Has personal data:", hasPersonalData);
    }
  }, [user, profile, hasPersonalData]);

  return {
    profile,
    loading,
    error,
    hasPersonalData,
    fetchProfile,
    refreshProfile,
  };
};
