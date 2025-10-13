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

  // FATCA and PEP Data
  fatca_data?: any; // JSONB field for FATCA information
  pep_data?: any; // JSONB field for PEP information

  created_at: string;
  updated_at: string;
}

interface Application {
  id: string;
  user_id: string;
  application_number: string;
  account_type: string;
  agency_id: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

interface ProfileState {
  profile: PersonalData | null;
  application: Application | null;
  loading: boolean;
  error: string | null;
  hasPersonalData: boolean;
  hasSubmittedApplication: boolean;
}

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useUserProfile = (
  user: User | null
): ProfileState & ProfileActions => {
  const [profile, setProfile] = useState<PersonalData | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch personal data
      const { data: profileData, error: profileError } = await supabase
        .from("personal_data")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        // If profile doesn't exist, that's okay - user needs to complete signup
        if (profileError.code === "PGRST116") {
          setProfile(null);
        } else {
          setError(profileError.message);
        }
      } else {
        setProfile(profileData);
      }

      // Fetch application data
      const { data: applicationData, error: applicationError } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (applicationError) {
        // If application doesn't exist, that's okay - user hasn't submitted yet
        if (applicationError.code === "PGRST116") {
          setApplication(null);
        } else {
          console.error("Error fetching application:", applicationError);
          setApplication(null);
        }
      } else {
        setApplication(applicationData);
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

  // Check if user has a submitted application
  const hasSubmittedApplication = Boolean(
    application?.status === "submitted" ||
      application?.status === "under_review" ||
      application?.status === "approved"
  );

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("useUserProfile: User ID:", user.id);
      console.log("useUserProfile: Profile:", profile);
      console.log("useUserProfile: Application:", application);
      console.log("useUserProfile: Has personal data:", hasPersonalData);
      console.log(
        "useUserProfile: Has submitted application:",
        hasSubmittedApplication
      );
    }
  }, [user, profile, application, hasPersonalData, hasSubmittedApplication]);

  return {
    profile,
    application,
    loading,
    error,
    hasPersonalData,
    hasSubmittedApplication,
    fetchProfile,
    refreshProfile,
  };
};
