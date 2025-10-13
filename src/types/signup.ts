// Signup Step 1: Basic Authentication
export interface SignupStep1Data {
  email: string;
  password: string;
  confirmPassword: string;
}

// ID Card Information
export interface IdCardInfo {
  type:
    | "carte_electeur"
    | "carte_identite"
    | "permis_conduire"
    | "passeport"
    | "autre";
  number: string;
  issueDate: string;
  expiryDate: string;
  otherType?: string; // For "autre" option
}

// Personal Information
export interface PersonalInfo {
  civility: "madame" | "mademoiselle" | "monsieur";
  lastName: string;
  middleName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  provinceOfOrigin: string;
  nationality: string;
  countryOfResidence: string;
}

// Marital and Family Information
export interface MaritalInfo {
  maritalStatus: "celibataire" | "marie" | "divorce" | "veuf";
  maritalRegime?:
    | "separation_biens"
    | "communaute_universelle"
    | "communaute_reduite";
  numberOfChildren: number;
}

// Housing Information
export interface HousingInfo {
  housingStatus: "proprietaire" | "locataire" | "loge_gratuit" | "loge_parents";
  permanentAddress: string;
  mailingAddress: string;
}

// Contact Information
export interface ContactInfo {
  phone1: string;
  phone2?: string;
  email1: string;
  email2?: string;
}

// Professional Information
export interface ProfessionalInfo {
  profession: string;
  employer: string;
  monthlyIncome: number;
  incomeOrigin: string;
}

// Emergency Contact
export interface EmergencyContact {
  contactPerson: string;
  contactPhone: string;
}

// Bank Selection
export interface BankSelection {
  howDidYouChooseRawbank:
    | "connaissance"
    | "relation_affaires"
    | "publicite"
    | "autres";
}

// Package Selection
export interface PackageSelection {
  packageType: "pack_eco" | "pack_standard" | "pack_premium";
  accountCurrency: "USD" | "CDF";
  cardType: "visa_classic" | "visa_gold" | "visa_platinum";
  digitalProducts: string[];
}

// FATCA Information
export interface FatcaInfo {
  isUSPerson: boolean;
  usCitizenship: boolean;
  usBirthPlace: boolean;
  usResidence: boolean;
  usAddress: boolean;
  usPhone: boolean;
  usPowerOfAttorney: boolean;
  usTin?: string; // Tax Identification Number
  declarationDate?: string;
  signature?: string;
}

// PEP (Politically Exposed Person) Information
export interface PepInfo {
  isPep: boolean;
  pepCategory?:
    | "government_official"
    | "political_party_leader"
    | "military_officer"
    | "judicial_official"
    | "state_enterprise_executive"
    | "family_member"
    | "close_associate";
  position?: string;
  organization?: string;
  country?: string;
  startDate?: string;
  endDate?: string; // nullable if currently serving
  relationshipToPep?: string; // if family member or close associate
  pepName?: string; // if family member or close associate
  declarationDate?: string;
  signature?: string;
}

// Complete Profile Data (Step 2)
export interface SignupStep2Data {
  idCard: IdCardInfo;
  personalInfo: PersonalInfo;
  maritalInfo: MaritalInfo;
  housingInfo: HousingInfo;
  contactInfo: ContactInfo;
  professionalInfo: ProfessionalInfo;
  emergencyContact: EmergencyContact;
  bankSelection: BankSelection;
  packageSelection: PackageSelection;
  fatcaInfo?: FatcaInfo;
  pepInfo?: PepInfo;
}

// Complete Signup Data
export interface CompleteSignupData extends SignupStep1Data, SignupStep2Data {}

// Step definitions
export type SignupStep =
  | "step1"
  | "step2_id"
  | "step2_identity"        // Personal identity information
  | "step2_marital"         // Marital status information
  | "step2_housing"         // Housing information
  | "step2_contact"         // Contact information
  | "step2_professional"    // Professional information
  | "step2_emergency"       // Emergency contact
  | "step2_fatca"           // FATCA declaration
  | "step2_pep"             // PEP declaration
  | "step2_bank"            // Bank selection
  | "step2_package"         // Package selection
  | "complete";

// Form validation errors
export interface SignupFormErrors {
  [key: string]: string | undefined;
}
