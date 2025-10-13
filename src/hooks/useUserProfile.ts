import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface PersonalData {
  id: string;
  // Identity Information
  civility?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  birth_date?: string;
  birth_place?: string;
  province_of_origin?: string;
  nationality?: string;
  country_of_residence?: string;

  // Identification Document
  id_type?: string;
  id_number?: string;
  id_issue_date?: string;
  id_expiry_date?: string;

  // Personal Situation
  marital_status?: string;
  marital_regime?: string;
  number_of_children?: number;

  // Housing Information
  housing_status?: string;
  permanent_address?: string;
  mailing_address?: string;

  // Contact Information
  phone_1?: string;
  phone_2?: string;
  email_1?: string;
  email_2?: string;

  // Professional Information
  profession?: string;
  employer?: string;
  monthly_gross_income?: number;
  income_source?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;

  // Completion status
  profile_completion_percentage?: number;
  fatca_completed?: boolean;
  pep_completed?: boolean;

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

  // Check if user has personal data (has essential fields filled)
  const hasPersonalData = Boolean(
    profile?.first_name &&
      profile?.last_name &&
      profile?.birth_date &&
      profile?.nationality &&
      profile?.id_number &&
      profile?.phone_1 &&
      profile?.email_1
  );

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
