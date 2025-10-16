import { User } from "@supabase/supabase-js";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

// Types from existing hooks
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
  card_type?: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

interface ApplicationContextValue {
  user: User | null;
  profile: PersonalData | null;
  application: Application | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<PersonalData>) => Promise<void>;
  updateApplication: (data: Partial<Application>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshApplication: () => Promise<void>;
  refreshAll: () => Promise<void>;
  signOut: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextValue | undefined>(
  undefined
);

interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<PersonalData | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedUserId = useRef<string | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async (userId: string) => {
    try {
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
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  // Fetch application data
  const fetchApplication = useCallback(async (userId: string) => {
    try {
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
      console.error("Error fetching application:", err);
      setApplication(null);
    }
  }, []); // Empty dependency array since this function doesn't depend on any external values

  // Update profile data
  const updateProfile = useCallback(
    async (data: Partial<PersonalData>) => {
      if (!user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("personal_data")
          .select("id")
          .eq("id", user.id)
          .single();

        const updateData = {
          ...data,
          updated_at: new Date().toISOString(),
        };

        let result;
        if (existingProfile) {
          // Update existing profile
          const { data: updatedData, error: updateError } = await supabase
            .from("personal_data")
            .update(updateData)
            .eq("id", user.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }
          result = updatedData;
        } else {
          // Insert new profile
          const { data: insertedData, error: insertError } = await supabase
            .from("personal_data")
            .insert({
              id: user.id,
              ...updateData,
            })
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }
          result = insertedData;
        }

        // Update context state
        setProfile(result);
      } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
      }
    },
    [user?.id]
  );

  // Update application data
  const updateApplication = useCallback(
    async (data: Partial<Application>) => {
      if (!user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        // Check if application exists
        const { data: existingApplication } = await supabase
          .from("applications")
          .select("id")
          .eq("user_id", user.id)
          .single();

        const updateData = {
          ...data,
          updated_at: new Date().toISOString(),
        };

        let result;
        if (existingApplication) {
          // Update existing application
          const { data: updatedData, error: updateError } = await supabase
            .from("applications")
            .update(updateData)
            .eq("id", existingApplication.id)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }
          result = updatedData;
        } else {
          // Insert new application
          const { data: insertedData, error: insertError } = await supabase
            .from("applications")
            .insert({
              user_id: user.id,
              ...updateData,
            })
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }
          result = insertedData;
        }

        // Update context state
        setApplication(result);
      } catch (err) {
        console.error("Error updating application:", err);
        throw err;
      }
    },
    [user?.id]
  );

  // Refresh functions
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const refreshApplication = useCallback(async () => {
    if (user?.id) {
      await fetchApplication(user.id);
    }
  }, [user?.id, fetchApplication]);

  const refreshAll = useCallback(async () => {
    if (user?.id) {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchProfile(user.id), fetchApplication(user.id)]);
      } catch (err) {
        console.error("Error fetching all data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
  }, [user?.id, fetchProfile, fetchApplication]);

  // Fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      // Only fetch if we haven't already fetched for this user
      if (lastFetchedUserId.current !== user.id) {
        console.log("ApplicationContext: Fetching data for user:", user.id);
        lastFetchedUserId.current = user.id;
        setLoading(true);
        setError(null);

        Promise.all([fetchProfile(user.id), fetchApplication(user.id)])
          .catch((err) => {
            console.error("Error fetching all data:", err);
            setError(
              err instanceof Error ? err.message : "Failed to fetch data"
            );
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        console.log(
          "ApplicationContext: Skipping fetch - already fetched for user:",
          user.id
        );
      }
    } else {
      // Clear data when user logs out
      console.log("ApplicationContext: Clearing data - no user");
      lastFetchedUserId.current = null;
      setProfile(null);
      setApplication(null);
      setError(null);
    }
  }, [user?.id, fetchProfile, fetchApplication]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Clear all local state
      lastFetchedUserId.current = null;
      setProfile(null);
      setApplication(null);
      setError(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err.message : "Failed to sign out");
    }
  }, []);

  const value: ApplicationContextValue = {
    user,
    profile,
    application,
    loading: authLoading || loading,
    error,
    updateProfile,
    updateApplication,
    refreshProfile,
    refreshApplication,
    refreshAll,
    signOut,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook to use the ApplicationContext
export const useApplicationContext = (): ApplicationContextValue => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider"
    );
  }
  return context;
};
