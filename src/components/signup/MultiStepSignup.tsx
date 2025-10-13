import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSignupForm } from "../../hooks/useSignupForm";
import { useUserProfile } from "../../hooks/useUserProfile";
import { supabase } from "../../lib/supabase";
import IdCardUpload from "./IdCardUpload";
import SignupSkeleton from "./SignupSkeleton";
import SignupStep1 from "./SignupStep1";

const MultiStepSignup: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasPersonalData } = useUserProfile(user);

  const {
    currentStep,
    step1Data,
    step2Data,
    errors,
    loading,
    setLoading,
    updateStep1Data,
    updateStep2Data,
    nextStep,
    prevStep,
    validateCurrentStep,
    getCompleteData,
    resetForm,
  } = useSignupForm(user ? "step2_id" : "step1", user);

  const [message, setMessage] = useState<string>("");

  // Handle redirects for existing users
  useEffect(() => {
    if (user && hasPersonalData) {
      console.log(
        "MultiStepSignup: User has personal data, redirecting to /app"
      );
      // User has complete profile - redirect to app
      navigate("/app");
    }
  }, [user, hasPersonalData, navigate]);

  // Handle Step 1 submission (email/password signup)
  const handleStep1Submit = useCallback(async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: step1Data.email,
        password: step1Data.password,
        options: {
          data: {
            step: "step1_complete",
          },
        },
      });

      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage(
          "Vérifiez votre email pour confirmer votre compte, puis continuez avec votre profil."
        );
        // Move to next step after successful signup
        setTimeout(() => {
          nextStep();
        }, 2000);
      }
    } catch (error) {
      setMessage(
        `Erreur: ${
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [step1Data, validateCurrentStep, setLoading, nextStep]);

  // Handle Step 2 ID upload
  const handleIdCardNext = useCallback(() => {
    // Here you would typically upload the file and extract data with OpenAI
    // For now, we'll just move to the next step
    nextStep();
  }, [nextStep]);

  // Handle final submission
  const handleFinalSubmit = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const completeData = getCompleteData();

      // Update user metadata with complete profile
      const { error } = await supabase.auth.updateUser({
        data: {
          step: "complete",
          profile_complete: true,
          ...completeData,
        },
      });

      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage(
          "Votre compte a été créé avec succès! Bienvenue chez Rawbank."
        );
        // Redirect to app after successful signup
        navigate("/app");
      }
    } catch (error) {
      setMessage(
        `Erreur: ${
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [getCompleteData, setLoading]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    await signOut();
    setMessage("");
    resetForm();
  }, [signOut, resetForm]);

  // Check if user is already signed in and redirect if needed
  React.useEffect(() => {
    if (user && hasPersonalData) {
      navigate("/app");
    }
  }, [user, hasPersonalData, navigate]);

  // If user is logged in and has personal data, redirect to app
  if (user && hasPersonalData) {
    navigate("/app");
    return null;
  }

  // Show loading skeleton
  if (loading && currentStep !== "step1") {
    return <SignupSkeleton stepType={currentStep as any} />;
  }

  // Render current step
  switch (currentStep) {
    case "step1":
      return (
        <SignupStep1
          data={step1Data}
          errors={errors}
          loading={loading}
          onDataChange={updateStep1Data}
          onSubmit={handleStep1Submit}
          isLoggedIn={!!user}
        />
      );

    case "step2_id":
      return (
        <IdCardUpload
          data={step2Data.idCard}
          onDataChange={(data) =>
            updateStep2Data({ idCard: { ...step2Data.idCard, ...data } })
          }
          onNext={handleIdCardNext}
          onPrev={prevStep}
          loading={loading}
        />
      );

    // Add other steps here as we implement them
    default:
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "3rem",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
            }}
          >
            <h2 style={{ color: "#1e3c72", marginBottom: "1rem" }}>
              Étape en cours de développement
            </h2>
            <p style={{ marginBottom: "2rem", color: "#666" }}>
              Cette étape sera bientôt disponible.
            </p>
            <button
              onClick={prevStep}
              style={{
                background: "#1e3c72",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Retour
            </button>
          </div>
        </div>
      );
  }
};

export default MultiStepSignup;
