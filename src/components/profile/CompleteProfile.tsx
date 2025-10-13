import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSignupForm } from "../../hooks/useSignupForm";
import { useUserProfile } from "../../hooks/useUserProfile";
import { supabase } from "../../lib/supabase";
import { SignupStep } from "../../types/signup";
import IdCardUploadWithAI from "../signup/IdCardUploadWithAI";
import SignupSkeleton from "../signup/SignupSkeleton";
import PersonalInfoForm from "./PersonalInfoForm";

const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#FFFFFF", // Clean Apple-like white background
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

interface CompleteProfileProps {
  step?: SignupStep;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ step }) => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { hasPersonalData, loading: profileLoading } = useUserProfile(user);

  // Determine initial step based on route or default to id card
  const initialStep = step || "step2_id";

  const {
    currentStep,
    step1Data,
    step2Data,
    errors,
    loading,
    setLoading,
    updateStep2Data,
    nextStep,
    prevStep,
    getCompleteData,
    resetForm,
    goToStep,
  } = useSignupForm(initialStep, user);

  const [message, setMessage] = useState<string>("");

  // Load existing data from database
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("personal_data")
          .select("step2_data")
          .eq("id", user.id)
          .single();

        if (!error && data?.step2_data) {
          // Merge existing data with current form data
          console.log("Loading existing profile data:", data.step2_data);
          Object.keys(data.step2_data).forEach((key) => {
            if (
              data.step2_data[key] &&
              typeof data.step2_data[key] === "object"
            ) {
              updateStep2Data({ [key]: data.step2_data[key] });
            }
          });
        }
      } catch (error) {
        console.error("Error loading existing data:", error);
      }
    };

    loadExistingData();
  }, [user?.id, updateStep2Data]);

  // Handle redirect if profile is complete
  useEffect(() => {
    // Wait for profile to load
    if (profileLoading) {
      return;
    }

    // Redirect to app if profile is complete
    if (user && hasPersonalData) {
      console.log(
        "CompleteProfile: User has personal data, redirecting to /app"
      );
      navigate("/app", { replace: true });
    }
  }, [user, hasPersonalData, profileLoading, navigate]);

  // Save current step data to database
  const saveStepData = useCallback(
    async (stepData: any) => {
      if (!user?.id) return { success: false, error: "User not authenticated" };

      try {
        // Check if personal_data record exists
        const { data: existingData, error: fetchError } = await supabase
          .from("personal_data")
          .select("*")
          .eq("id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // Error other than "not found"
          return { success: false, error: fetchError.message };
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("personal_data")
            .update({
              step2_data: stepData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (updateError) {
            return { success: false, error: updateError.message };
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from("personal_data")
            .insert({
              id: user.id,
              step2_data: stepData,
            });

          if (insertError) {
            return { success: false, error: insertError.message };
          }
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    [user?.id]
  );

  // Handle ID card upload next
  const handleIdCardNext = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Process ID card with OpenAI
      console.log("Processing ID card...");

      // Save ID card data to database
      const result = await saveStepData(step2Data);

      if (!result.success) {
        setMessage(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to personal info step
      navigate("/profile/personal-info");
    } catch (error) {
      console.error("Error processing ID card:", error);
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
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle personal info next
  const handlePersonalInfoNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save personal info data to database
      const result = await saveStepData(step2Data);

      if (!result.success) {
        setMessage(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Check if FATCA is applicable (e.g., based on nationality or tax residency)
      const fatcaApplicable = checkFatcaApplicable(step2Data.personalInfo);

      if (fatcaApplicable) {
        navigate("/profile/fatca");
      } else {
        // Check if PEP declaration is needed
        navigate("/profile/pep");
      }
    } catch (error) {
      console.error("Error saving personal info:", error);
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
  }, [navigate, step2Data, saveStepData, setLoading]);

  // Check if FATCA is applicable
  const checkFatcaApplicable = (personalInfo: any): boolean => {
    // FATCA applies if:
    // - US citizen
    // - Born in US
    // - US resident
    // - US address or phone
    // This is a simplified check - adjust based on requirements
    return false; // Will be determined by actual data
  };

  // Handle final submission
  const handleFinalSubmit = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Save final step data with completion markers
      const { data: existingData, error: fetchError } = await supabase
        .from("personal_data")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        setMessage(`Erreur: ${fetchError.message}`);
        return;
      }

      const updateData = {
        step2_data: step2Data,
        profile_completion_percentage: 100,
        fatca_completed: step2Data.fatcaInfo ? true : false,
        pep_completed: step2Data.pepInfo ? true : false,
        updated_at: new Date().toISOString(),
      };

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("personal_data")
          .update(updateData)
          .eq("id", user.id);

        if (updateError) {
          setMessage(`Erreur: ${updateError.message}`);
          return;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("personal_data")
          .insert({
            id: user.id,
            ...updateData,
          });

        if (insertError) {
          setMessage(`Erreur: ${insertError.message}`);
          return;
        }
      }

      setMessage(
        "Votre profil a été complété avec succès! Bienvenue chez Rawbank."
      );

      // Redirect to app after successful profile completion
      navigate("/app");
    } catch (error) {
      setMessage(
        `Erreur: ${
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"
        }`
      );
    }
  }, [step2Data, navigate, user?.id]);

  // Handle FATCA next
  const handleFatcaNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save FATCA data to database
      const result = await saveStepData(step2Data);

      if (!result.success) {
        setMessage(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to PEP step
      navigate("/profile/pep");
    } catch (error) {
      console.error("Error saving FATCA data:", error);
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
  }, [navigate, step2Data, saveStepData, setLoading]);

  // Handle PEP next
  const handlePepNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save PEP data to database and mark profile as complete
      await handleFinalSubmit();
    } catch (error) {
      console.error("Error saving PEP data:", error);
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
  }, [handleFinalSubmit, setLoading]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    await signOut();
    setMessage("");
    resetForm();
  }, [signOut, resetForm]);

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <GradientBox>
        <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Vérification de l'authentification...
            </Typography>
          </CardContent>
        </Card>
      </GradientBox>
    );
  }

  // Show loading skeleton
  if (loading && currentStep !== "step2_id") {
    return <SignupSkeleton stepType={currentStep as any} />;
  }

  // Render current step
  switch (currentStep) {
    case "step2_id":
      return (
        <IdCardUploadWithAI
          data={step2Data.idCard}
          onDataChange={(data) =>
            updateStep2Data({ idCard: { ...step2Data.idCard, ...data } })
          }
          onNext={handleIdCardNext}
          onPrev={() => navigate("/login")}
          loading={loading}
        />
      );

    case "step2_personal":
      return (
        <PersonalInfoForm
          personalInfo={step2Data.personalInfo}
          maritalInfo={step2Data.maritalInfo}
          housingInfo={step2Data.housingInfo}
          contactInfo={step2Data.contactInfo}
          professionalInfo={step2Data.professionalInfo}
          emergencyContact={step2Data.emergencyContact}
          onDataChange={(data) => {
            // Merge the partial data with existing data
            const updatedData: any = {};
            if (data.personalInfo) {
              updatedData.personalInfo = {
                ...step2Data.personalInfo,
                ...data.personalInfo,
              };
            }
            if (data.maritalInfo) {
              updatedData.maritalInfo = {
                ...step2Data.maritalInfo,
                ...data.maritalInfo,
              };
            }
            if (data.housingInfo) {
              updatedData.housingInfo = {
                ...step2Data.housingInfo,
                ...data.housingInfo,
              };
            }
            if (data.contactInfo) {
              updatedData.contactInfo = {
                ...step2Data.contactInfo,
                ...data.contactInfo,
              };
            }
            if (data.professionalInfo) {
              updatedData.professionalInfo = {
                ...step2Data.professionalInfo,
                ...data.professionalInfo,
              };
            }
            if (data.emergencyContact) {
              updatedData.emergencyContact = {
                ...step2Data.emergencyContact,
                ...data.emergencyContact,
              };
            }
            updateStep2Data(updatedData);
          }}
          onNext={handlePersonalInfoNext}
          onPrev={() => navigate("/profile/id-card")}
          loading={loading}
        />
      );

    case "step2_fatca":
      return (
        <GradientBox>
          <Card sx={{ maxWidth: 800, margin: "0 auto" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Déclaration FATCA
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cette étape sera bientôt disponible.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Current step: {currentStep}
              </Typography>
            </CardContent>
          </Card>
        </GradientBox>
      );

    case "step2_pep":
      return (
        <GradientBox>
          <Card sx={{ maxWidth: 800, margin: "0 auto" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Personne Politiquement Exposée (PPE)
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cette étape sera bientôt disponible.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Current step: {currentStep}
              </Typography>
            </CardContent>
          </Card>
        </GradientBox>
      );

    default:
      return (
        <GradientBox>
          <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                Étape en cours de développement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cette étape sera bientôt disponible.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Current step: {currentStep}
              </Typography>
            </CardContent>
          </Card>
        </GradientBox>
      );
  }
};

export default CompleteProfile;
