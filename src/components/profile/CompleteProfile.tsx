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
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          // Map database columns to form data structure
          console.log("Loading existing profile data:", data);

          // Map ID card data
          if (
            data.id_type ||
            data.id_number ||
            data.id_issue_date ||
            data.id_expiry_date
          ) {
            updateStep2Data({
              idCard: {
                type: data.id_type,
                number: data.id_number,
                issueDate: data.id_issue_date,
                expiryDate: data.id_expiry_date,
              },
            });
          }

          // Map personal info data
          if (
            data.first_name ||
            data.last_name ||
            data.birth_date ||
            data.nationality
          ) {
            updateStep2Data({
              personalInfo: {
                civility: data.civility,
                firstName: data.first_name,
                middleName: data.middle_name,
                lastName: data.last_name,
                birthDate: data.birth_date,
                birthPlace: data.birth_place,
                provinceOfOrigin: data.province_of_origin,
                nationality: data.nationality,
                countryOfResidence: data.country_of_residence,
              },
            });
          }

          // Map marital info data
          if (data.marital_status) {
            updateStep2Data({
              maritalInfo: {
                maritalStatus: data.marital_status,
                maritalRegime: data.marital_regime,
                numberOfChildren: data.number_of_children,
              },
            });
          }

          // Map housing info data
          if (data.housing_status || data.permanent_address) {
            updateStep2Data({
              housingInfo: {
                housingStatus: data.housing_status,
                permanentAddress: data.permanent_address,
                mailingAddress: data.mailing_address,
              },
            });
          }

          // Map contact info data
          if (data.phone_1 || data.email_1) {
            updateStep2Data({
              contactInfo: {
                phone1: data.phone_1,
                phone2: data.phone_2,
                email1: data.email_1,
                email2: data.email_2,
              },
            });
          }

          // Map professional info data
          if (data.profession || data.employer) {
            updateStep2Data({
              professionalInfo: {
                profession: data.profession,
                employer: data.employer,
                monthlyIncome: data.monthly_gross_income,
                incomeOrigin: data.income_source,
              },
            });
          }

          // Map emergency contact data
          if (data.emergency_contact_name || data.emergency_contact_phone) {
            updateStep2Data({
              emergencyContact: {
                contactPerson: data.emergency_contact_name,
                contactPhone: data.emergency_contact_phone,
              },
            });
          }
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

        // Map step data to individual columns
        const updateData: any = {
          updated_at: new Date().toISOString(),
        };

        // Map ID card data
        if (stepData.idCard) {
          updateData.id_type = stepData.idCard.type;
          updateData.id_number = stepData.idCard.number;
          updateData.id_issue_date = stepData.idCard.issueDate;
          updateData.id_expiry_date = stepData.idCard.expiryDate;
        }

        // Map personal info data
        if (stepData.personalInfo) {
          updateData.civility = stepData.personalInfo.civility;
          updateData.first_name = stepData.personalInfo.firstName;
          updateData.middle_name = stepData.personalInfo.middleName;
          updateData.last_name = stepData.personalInfo.lastName;
          updateData.birth_date = stepData.personalInfo.birthDate;
          updateData.birth_place = stepData.personalInfo.birthPlace;
          updateData.province_of_origin =
            stepData.personalInfo.provinceOfOrigin;
          updateData.nationality = stepData.personalInfo.nationality;
          updateData.country_of_residence =
            stepData.personalInfo.countryOfResidence;
        }

        // Map marital info data
        if (stepData.maritalInfo) {
          updateData.marital_status = stepData.maritalInfo.maritalStatus;
          updateData.marital_regime = stepData.maritalInfo.maritalRegime;
          updateData.number_of_children = stepData.maritalInfo.numberOfChildren;
        }

        // Map housing info data
        if (stepData.housingInfo) {
          updateData.housing_status = stepData.housingInfo.housingStatus;
          updateData.permanent_address = stepData.housingInfo.permanentAddress;
          updateData.mailing_address = stepData.housingInfo.mailingAddress;
        }

        // Map contact info data
        if (stepData.contactInfo) {
          updateData.phone_1 = stepData.contactInfo.phone1;
          updateData.phone_2 = stepData.contactInfo.phone2;
          updateData.email_1 = stepData.contactInfo.email1;
          updateData.email_2 = stepData.contactInfo.email2;
        }

        // Map professional info data
        if (stepData.professionalInfo) {
          updateData.profession = stepData.professionalInfo.profession;
          updateData.employer = stepData.professionalInfo.employer;
          updateData.monthly_gross_income =
            stepData.professionalInfo.monthlyIncome;
          updateData.income_source = stepData.professionalInfo.incomeOrigin;
        }

        // Map emergency contact data
        if (stepData.emergencyContact) {
          updateData.emergency_contact_name =
            stepData.emergencyContact.contactPerson;
          updateData.emergency_contact_phone =
            stepData.emergencyContact.contactPhone;
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("personal_data")
            .update(updateData)
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
              ...updateData,
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

      // Map step data to individual columns
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Map ID card data
      if (step2Data.idCard) {
        updateData.id_type = step2Data.idCard.type;
        updateData.id_number = step2Data.idCard.number;
        updateData.id_issue_date = step2Data.idCard.issueDate;
        updateData.id_expiry_date = step2Data.idCard.expiryDate;
      }

      // Map personal info data
      if (step2Data.personalInfo) {
        updateData.civility = step2Data.personalInfo.civility;
        updateData.first_name = step2Data.personalInfo.firstName;
        updateData.middle_name = step2Data.personalInfo.middleName;
        updateData.last_name = step2Data.personalInfo.lastName;
        updateData.birth_date = step2Data.personalInfo.birthDate;
        updateData.birth_place = step2Data.personalInfo.birthPlace;
        updateData.province_of_origin = step2Data.personalInfo.provinceOfOrigin;
        updateData.nationality = step2Data.personalInfo.nationality;
        updateData.country_of_residence =
          step2Data.personalInfo.countryOfResidence;
      }

      // Map marital info data
      if (step2Data.maritalInfo) {
        updateData.marital_status = step2Data.maritalInfo.maritalStatus;
        updateData.marital_regime = step2Data.maritalInfo.maritalRegime;
        updateData.number_of_children = step2Data.maritalInfo.numberOfChildren;
      }

      // Map housing info data
      if (step2Data.housingInfo) {
        updateData.housing_status = step2Data.housingInfo.housingStatus;
        updateData.permanent_address = step2Data.housingInfo.permanentAddress;
        updateData.mailing_address = step2Data.housingInfo.mailingAddress;
      }

      // Map contact info data
      if (step2Data.contactInfo) {
        updateData.phone_1 = step2Data.contactInfo.phone1;
        updateData.phone_2 = step2Data.contactInfo.phone2;
        updateData.email_1 = step2Data.contactInfo.email1;
        updateData.email_2 = step2Data.contactInfo.email2;
      }

      // Map professional info data
      if (step2Data.professionalInfo) {
        updateData.profession = step2Data.professionalInfo.profession;
        updateData.employer = step2Data.professionalInfo.employer;
        updateData.monthly_gross_income =
          step2Data.professionalInfo.monthlyIncome;
        updateData.income_source = step2Data.professionalInfo.incomeOrigin;
      }

      // Map emergency contact data
      if (step2Data.emergencyContact) {
        updateData.emergency_contact_name =
          step2Data.emergencyContact.contactPerson;
        updateData.emergency_contact_phone =
          step2Data.emergencyContact.contactPhone;
      }

      // Add completion markers (if these columns exist from FATCA/PEP migration)
      updateData.profile_completion_percentage = 100;
      updateData.fatca_completed = step2Data.fatcaInfo ? true : false;
      updateData.pep_completed = step2Data.pepInfo ? true : false;

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
