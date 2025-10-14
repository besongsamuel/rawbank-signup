import { Box, Card, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSignupForm } from "../../hooks/useSignupForm";
import { useUserProfile } from "../../hooks/useUserProfile";
import { supabase } from "../../lib/supabase";
import { SignupStep } from "../../types/signup";
import IdCardUploadWithAI from "../signup/IdCardUploadWithAI";
import SignupSkeleton from "../signup/SignupSkeleton";
import SignupStepper from "./SignupStepper";
import AccountSelectionStep from "./steps/AccountSelectionStep";
import ContactStep from "./steps/ContactStep";
import EmergencyContactStep from "./steps/EmergencyContactStep";
import FatcaStep from "./steps/FatcaStep";
import HousingStep from "./steps/HousingStep";
import IdentityStep from "./steps/IdentityStep";
import MaritalStep from "./steps/MaritalStep";
import PepStep from "./steps/PepStep";
import ProfessionalStep from "./steps/ProfessionalStep";
import ReviewStep from "./steps/ReviewStep";

interface CompleteProfileProps {
  step?: SignupStep;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ step }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { hasSubmittedApplication, loading: profileLoading } =
    useUserProfile(user);

  // Determine current step from URL path
  const getCurrentStepFromPath = (pathname: string): SignupStep => {
    switch (pathname) {
      case "/profile/account-selection":
        return "step2_account";
      case "/profile/id-card":
        return "step2_id";
      case "/profile/identity":
        return "step2_identity";
      case "/profile/marital":
        return "step2_marital";
      case "/profile/housing":
        return "step2_housing";
      case "/profile/contact":
        return "step2_contact";
      case "/profile/professional":
        return "step2_professional";
      case "/profile/emergency":
        return "step2_emergency";
      case "/profile/fatca":
        return "step2_fatca";
      case "/profile/pep":
        return "step2_pep";
      case "/profile/review":
        return "step2_review";
      default:
        return "step2_account";
    }
  };

  const currentStep = getCurrentStepFromPath(location.pathname);

  const { step2Data, loading, setLoading, updateStep2Data, clearErrors } =
    useSignupForm(currentStep, user);

  // Clear errors when step changes
  useEffect(() => {
    clearErrors();
  }, [currentStep, clearErrors]);

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

    // Redirect to app if user has submitted application
    if (user && hasSubmittedApplication) {
      console.log(
        "CompleteProfile: User has submitted application, redirecting to /app"
      );
      navigate("/app", { replace: true });
    }
  }, [user, hasSubmittedApplication, profileLoading, navigate]);

  // Save specific step data to database
  const saveStepData = useCallback(
    async (stepData: any, stepType: string) => {
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

        // Map step data to individual columns based on step type
        const updateData: any = {
          updated_at: new Date().toISOString(),
        };

        // Map data based on step type
        switch (stepType) {
          case "idCard":
            if (stepData.idCard) {
              updateData.id_type = stepData.idCard.type;
              updateData.id_number = stepData.idCard.number;
              updateData.id_issue_date = stepData.idCard.issueDate;
              updateData.id_expiry_date = stepData.idCard.expiryDate;
            }
            break;

          case "personalInfo":
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
            break;

          case "maritalInfo":
            if (stepData.maritalInfo) {
              updateData.marital_status = stepData.maritalInfo.maritalStatus;
              updateData.marital_regime = stepData.maritalInfo.maritalRegime;
              updateData.number_of_children =
                stepData.maritalInfo.numberOfChildren;
            }
            break;

          case "housingInfo":
            if (stepData.housingInfo) {
              updateData.housing_status = stepData.housingInfo.housingStatus;
              updateData.permanent_address =
                stepData.housingInfo.permanentAddress;
              updateData.mailing_address = stepData.housingInfo.mailingAddress;
            }
            break;

          case "contactInfo":
            if (stepData.contactInfo) {
              updateData.phone_1 = stepData.contactInfo.phone1;
              updateData.phone_2 = stepData.contactInfo.phone2;
              updateData.email_1 = stepData.contactInfo.email1;
              updateData.email_2 = stepData.contactInfo.email2;
            }
            break;

          case "professionalInfo":
            if (stepData.professionalInfo) {
              updateData.profession = stepData.professionalInfo.profession;
              updateData.employer = stepData.professionalInfo.employer;
              updateData.monthly_gross_income =
                stepData.professionalInfo.monthlyIncome;
              updateData.income_source = stepData.professionalInfo.incomeOrigin;
            }
            break;

          case "emergencyContact":
            if (stepData.emergencyContact) {
              updateData.emergency_contact_name =
                stepData.emergencyContact.contactPerson;
              updateData.emergency_contact_phone =
                stepData.emergencyContact.contactPhone;
            }
            break;

          case "fatcaInfo":
            if (stepData.fatcaInfo) {
              updateData.fatca_data = stepData.fatcaInfo;
              updateData.fatca_completed = true;
            }
            break;

          case "pepInfo":
            if (stepData.pepInfo) {
              updateData.pep_data = stepData.pepInfo;
              updateData.pep_completed = true;
            }
            break;
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

  // Handle Account Selection next
  const handleAccountSelectionNext = useCallback(async () => {
    setLoading(true);
    try {
      // Application is already created in AccountSelectionStep component
      // Just navigate to ID card step
      navigate("/profile/id-card");
    } catch (error) {
      console.error("Error in account selection:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading]);

  // Handle ID card upload next
  const handleIdCardNext = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Process ID card with OpenAI
      console.log("Processing ID card...");

      // Save ID card data to database
      const result = await saveStepData(step2Data, "idCard");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to identity step
      navigate("/profile/identity");
    } catch (error) {
      console.error("Error processing ID card:", error);
      console.error(
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

  // Handle Identity step next
  const handleIdentityNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save personal info data to database
      const result = await saveStepData(step2Data, "personalInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to marital step
      navigate("/profile/marital");
    } catch (error) {
      console.error("Error saving identity data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle Marital step next
  const handleMaritalNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save marital info data to database
      const result = await saveStepData(step2Data, "maritalInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to housing step
      navigate("/profile/housing");
    } catch (error) {
      console.error("Error saving marital data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle Housing step next
  const handleHousingNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save housing info data to database
      const result = await saveStepData(step2Data, "housingInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to contact step
      navigate("/profile/contact");
    } catch (error) {
      console.error("Error saving housing data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle Contact step next
  const handleContactNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save contact info data to database
      const result = await saveStepData(step2Data, "contactInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to professional step
      navigate("/profile/professional");
    } catch (error) {
      console.error("Error saving contact data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle Professional step next
  const handleProfessionalNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save professional info data to database
      const result = await saveStepData(step2Data, "professionalInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to emergency step
      navigate("/profile/emergency");
    } catch (error) {
      console.error("Error saving professional data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

  // Handle Emergency Contact step next
  const handleEmergencyNext = useCallback(async () => {
    setLoading(true);
    try {
      // Save emergency contact data to database
      const result = await saveStepData(step2Data, "emergencyContact");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to FATCA step
      navigate("/profile/fatca");
    } catch (error) {
      console.error("Error saving emergency contact data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, setLoading, saveStepData, step2Data]);

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
        console.error(`Erreur: ${fetchError.message}`);
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
          console.error(`Erreur: ${updateError.message}`);
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
          console.error(`Erreur: ${insertError.message}`);
          return;
        }
      }

      console.error(
        "Votre profil a été complété avec succès! Bienvenue chez Rawbank."
      );

      // Redirect to app after successful profile completion
      navigate("/app");
    } catch (error) {
      console.error(
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
      const result = await saveStepData(step2Data, "fatcaInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to PEP step
      navigate("/profile/pep");
    } catch (error) {
      console.error("Error saving FATCA data:", error);
      console.error(
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
      // Save PEP data to database
      const result = await saveStepData(step2Data, "pepInfo");

      if (!result.success) {
        console.error(`Erreur lors de la sauvegarde: ${result.error}`);
        return;
      }

      // Move to review step
      navigate("/profile/review");
    } catch (error) {
      console.error("Error saving PEP data:", error);
      console.error(
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

  // Helper function to get step index
  const getStepIndex = (step: SignupStep): number => {
    const stepMap: Record<SignupStep, number> = {
      step1: -1,
      step2_account: 0,
      step2_id: 1,
      step2_identity: 2,
      step2_marital: 3,
      step2_housing: 4,
      step2_contact: 5,
      step2_professional: 6,
      step2_emergency: 7,
      step2_fatca: 8,
      step2_pep: 9,
      step2_review: 10,
      step2_bank: 11,
      step2_package: 12,
      complete: 13,
    };
    return stepMap[step] ?? 0;
  };

  // Handle step navigation from stepper
  const handleStepClick = useCallback(
    (step: SignupStep) => {
      // Only allow navigation to completed steps or current step
      const stepIndex = getStepIndex(step);
      const currentStepIndex = getStepIndex(currentStep);

      if (stepIndex <= currentStepIndex) {
        // Map step keys to actual URLs
        const stepUrlMap: Record<SignupStep, string> = {
          step1: "/login",
          step2_account: "/profile/account-selection",
          step2_id: "/profile/id-card",
          step2_identity: "/profile/identity",
          step2_marital: "/profile/marital",
          step2_housing: "/profile/housing",
          step2_contact: "/profile/contact",
          step2_professional: "/profile/professional",
          step2_emergency: "/profile/emergency",
          step2_fatca: "/profile/fatca",
          step2_pep: "/profile/pep",
          step2_review: "/profile/review",
          step2_bank: "/profile/bank",
          step2_package: "/profile/package",
          complete: "/app",
        };

        const targetUrl = stepUrlMap[step];
        if (targetUrl) {
          navigate(targetUrl);
        }
      }
    },
    [currentStep, navigate]
  );

  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return <SignupSkeleton />;
  }

  // Show loading skeleton
  if (loading && currentStep !== "step2_id") {
    return <SignupSkeleton stepType={currentStep as any} />;
  }

  // Render current step with stepper
  const renderStepWithStepper = (stepComponent: React.ReactNode) => {
    return (
      <Box sx={{ width: "100%", minHeight: "calc(100vh - 160px)" }}>
        <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#000000",
                mb: 1,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              Demande d'ouverture de compte
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 300,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Complétez votre profil pour finaliser votre demande
            </Typography>
          </Box>

          <SignupStepper
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          {stepComponent}
        </Box>
      </Box>
    );
  };

  // Render current step
  switch (currentStep) {
    case "step2_account":
      return renderStepWithStepper(
        <AccountSelectionStep
          data={step2Data.accountSelection}
          onDataChange={(data) =>
            updateStep2Data({
              accountSelection: { ...step2Data.accountSelection, ...data },
            })
          }
          onNext={handleAccountSelectionNext}
          onPrev={() => navigate("/login")}
          loading={loading}
        />
      );

    case "step2_id":
      return renderStepWithStepper(
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

    case "step2_identity":
      return renderStepWithStepper(
        <IdentityStep
          personalInfo={step2Data.personalInfo}
          onDataChange={(data) =>
            updateStep2Data({
              personalInfo: { ...step2Data.personalInfo, ...data },
            })
          }
          onNext={handleIdentityNext}
          onPrev={() => navigate("/profile/id-card")}
          loading={loading}
        />
      );

    case "step2_marital":
      return renderStepWithStepper(
        <MaritalStep
          maritalInfo={step2Data.maritalInfo}
          onDataChange={(data) =>
            updateStep2Data({
              maritalInfo: { ...step2Data.maritalInfo, ...data },
            })
          }
          onNext={handleMaritalNext}
          onPrev={() => navigate("/profile/identity")}
          loading={loading}
        />
      );

    case "step2_housing":
      return renderStepWithStepper(
        <HousingStep
          housingInfo={step2Data.housingInfo}
          onDataChange={(data) =>
            updateStep2Data({
              housingInfo: { ...step2Data.housingInfo, ...data },
            })
          }
          onNext={handleHousingNext}
          onPrev={() => navigate("/profile/marital")}
          loading={loading}
        />
      );

    case "step2_contact":
      return renderStepWithStepper(
        <ContactStep
          contactInfo={step2Data.contactInfo}
          onDataChange={(data) =>
            updateStep2Data({
              contactInfo: { ...step2Data.contactInfo, ...data },
            })
          }
          onNext={handleContactNext}
          onPrev={() => navigate("/profile/housing")}
          loading={loading}
        />
      );

    case "step2_professional":
      return renderStepWithStepper(
        <ProfessionalStep
          professionalInfo={step2Data.professionalInfo}
          onDataChange={(data) =>
            updateStep2Data({
              professionalInfo: { ...step2Data.professionalInfo, ...data },
            })
          }
          onNext={handleProfessionalNext}
          onPrev={() => navigate("/profile/contact")}
          loading={loading}
        />
      );

    case "step2_emergency":
      return renderStepWithStepper(
        <EmergencyContactStep
          emergencyContact={step2Data.emergencyContact}
          onDataChange={(data) =>
            updateStep2Data({
              emergencyContact: { ...step2Data.emergencyContact, ...data },
            })
          }
          onNext={handleEmergencyNext}
          onPrev={() => navigate("/profile/professional")}
          loading={loading}
        />
      );

    case "step2_fatca":
      return renderStepWithStepper(
        <FatcaStep
          fatcaInfo={
            step2Data.fatcaInfo || {
              isUSPerson: false,
              usCitizenship: false,
              usBirthPlace: false,
              usResidence: false,
              usAddress: false,
              usPhone: false,
              usPowerOfAttorney: false,
            }
          }
          onDataChange={(data) =>
            updateStep2Data({
              fatcaInfo: {
                ...(step2Data.fatcaInfo || {
                  isUSPerson: false,
                  usCitizenship: false,
                  usBirthPlace: false,
                  usResidence: false,
                  usAddress: false,
                  usPhone: false,
                  usPowerOfAttorney: false,
                }),
                ...data,
              },
            })
          }
          onNext={handleFatcaNext}
          onPrev={() => navigate("/profile/emergency")}
          loading={loading}
        />
      );

    case "step2_pep":
      return renderStepWithStepper(
        <PepStep
          pepInfo={
            step2Data.pepInfo || {
              isPep: false,
            }
          }
          onDataChange={(data) =>
            updateStep2Data({
              pepInfo: {
                ...(step2Data.pepInfo || {
                  isPep: false,
                }),
                ...data,
              },
            })
          }
          onNext={handlePepNext}
          onPrev={() => navigate("/profile/fatca")}
          loading={loading}
        />
      );

    case "step2_review":
      return renderStepWithStepper(
        <ReviewStep onPrev={() => navigate("/profile/pep")} loading={loading} />
      );

    default:
      return renderStepWithStepper(
        <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Étape en cours de développement
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cette étape sera bientôt disponible.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Current step: {currentStep}
            </Typography>
          </Card>
        </Box>
      );
  }
};

export default CompleteProfile;
