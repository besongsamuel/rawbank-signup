import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error getting session:", err);
        setError("Failed to check authentication status");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Capture authentication errors from various events
      if (event === "SIGNED_OUT") {
        setError(null);
      } else if (event === "PASSWORD_RECOVERY") {
        // Handle password recovery errors
        if (!session?.user) {
          setError("Password recovery failed. Please try again.");
        }
      } else if (event === "USER_UPDATED") {
        // Handle user update errors
        if (!session?.user) {
          setError("User update failed. Please try again.");
        }
      } else if (event === "TOKEN_REFRESHED") {
        // Handle token refresh errors
        if (!session?.user) {
          setError("Session expired. Please sign in again.");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      setUser(data.user);
      return { error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
  };
};
