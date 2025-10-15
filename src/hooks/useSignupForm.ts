import { User } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import {
  CompleteSignupData,
  SignupFormErrors,
  SignupStep,
  SignupStep1Data,
  SignupStep2Data,
} from "../types/signup";

const initialStep1Data: SignupStep1Data = {
  email: "",
  password: "",
  confirmPassword: "",
};

const initialStep2Data: SignupStep2Data = {
  accountSelection: {
    accountType: "",
    agencyId: "",
  },
  idCard: {
    type: "carte_identite",
    number: "",
    issueDate: "",
    expiryDate: "",
  },
  personalInfo: {
    civility: "monsieur",
    lastName: "",
    middleName: "",
    firstName: "",
    birthDate: "",
    birthPlace: "",
    provinceOfOrigin: "",
    nationality: "",
    countryOfResidence: "",
  },
  maritalInfo: {
    maritalStatus: "celibataire",
    numberOfChildren: 0,
  },
  housingInfo: {
    housingStatus: "locataire",
    permanentAddress: "",
    mailingAddress: "",
  },
  contactInfo: {
    phone1: "",
    email1: "",
  },
  professionalInfo: {
    profession: "",
    employer: "",
    monthlyIncome: 0,
    incomeOrigin: "",
  },
  emergencyContact: {
    contactPerson: "",
    contactPhone: "",
  },
  bankSelection: {
    howDidYouChooseRawbank: "connaissance",
  },
  packageSelection: {
    packageType: "pack_eco",
    accountCurrency: "USD",
    cardType: "visa_classic",
    digitalProducts: ["alert_sms"],
  },
  fatcaInfo: {
    isUSPerson: false,
    usCitizenship: false,
    usBirthPlace: false,
    usResidence: false,
    usAddress: false,
    usPhone: false,
    usPowerOfAttorney: false,
  },
  pepInfo: {
    isPep: false,
  },
};

export const useSignupForm = (
  currentStep: SignupStep = "step1",
  user?: User | null
) => {
  // Initialize step1Data with user email if user is provided
  const getInitialStep1Data = (): SignupStep1Data => {
    if (user?.email) {
      return {
        ...initialStep1Data,
        email: user.email,
      };
    }
    return initialStep1Data;
  };

  const [step1Data, setStep1Data] = useState<SignupStep1Data>(
    getInitialStep1Data()
  );
  const [step2Data, setStep2Data] = useState<SignupStep2Data>(initialStep2Data);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Clear errors when step changes
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Data update functions
  const updateStep1Data = useCallback((data: Partial<SignupStep1Data>) => {
    setStep1Data((prev) => ({ ...prev, ...data }));
  }, []);

  const updateStep2Data = useCallback(
    (
      data:
        | Partial<SignupStep2Data>
        | ((prev: SignupStep2Data) => Partial<SignupStep2Data>)
    ) => {
      if (typeof data === "function") {
        setStep2Data((prev) => ({ ...prev, ...data(prev) }));
      } else {
        setStep2Data((prev) => ({ ...prev, ...data }));
      }
    },
    []
  );

  // Validation functions
  const validateStep1 = useCallback((): boolean => {
    const newErrors: SignupFormErrors = {};

    if (!step1Data.email) {
      newErrors.email = "Email est requis";
    } else if (!/\S+@\S+\.\S+/.test(step1Data.email)) {
      newErrors.email = "Email invalide";
    }

    if (!step1Data.password) {
      newErrors.password = "Mot de passe requis";
    } else if (step1Data.password.length < 8) {
      newErrors.password = "Mot de passe doit contenir au moins 8 caractères";
    }

    if (step1Data.password !== step1Data.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step1Data]);

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case "step1":
        return validateStep1();
      // Add validation for other steps as needed
      default:
        return true;
    }
  }, [currentStep, validateStep1]);

  // Get complete data
  const getCompleteData = useCallback((): CompleteSignupData => {
    return {
      ...step1Data,
      ...step2Data,
    };
  }, [step1Data, step2Data]);

  // Reset form
  const resetForm = useCallback(() => {
    setStep1Data(initialStep1Data);
    setStep2Data(initialStep2Data);
    setErrors({});
    setLoading(false);
  }, []);

  return {
    // State
    currentStep,
    step1Data,
    step2Data,
    errors,
    loading,

    // Actions
    setLoading,
    updateStep1Data,
    updateStep2Data,
    validateCurrentStep,
    getCompleteData,
    resetForm,
    clearErrors,

    // Computed
    isFirstStep: currentStep === "step1",
    isLastStep: currentStep === "complete",
  };
};
