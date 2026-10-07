import type { UserProfileRecord } from '../lib/dataClient';
import {
  ACCOUNT_TYPES,
  AGENCIES,
  CARD_OPTIONS,
  agencyById,
  labelFor,
} from './catalog';

export interface DossierStep {
  id: string;
  label: string;
  path: string;
  summary: (profile: UserProfileRecord | null) => string;
  done: (profile: UserProfileRecord | null) => boolean;
}

function text(value?: string | null) {
  return value?.trim() ?? '';
}

export const DOSSIER_STEPS: DossierStep[] = [
  {
    id: 'account',
    label: 'Compte et agence',
    path: '/onboarding/account',
    done: (profile) => Boolean(text(profile?.accountType) && text(profile?.agencyId)),
    summary: (profile) => {
      const account = labelFor(ACCOUNT_TYPES, profile?.accountType);
      const agency = agencyById(profile?.agencyId)?.name;
      return [account, agency].filter(Boolean).join(' · ');
    },
  },
  {
    id: 'identity',
    label: 'Identité',
    path: '/onboarding/id-upload',
    done: (profile) =>
      Boolean(profile?.extractionConfirmed && text(profile.firstName) && text(profile.idNumber)),
    summary: (profile) =>
      [profile?.firstName, profile?.lastName].filter(Boolean).join(' '),
  },
  {
    id: 'family',
    label: 'Famille et logement',
    path: '/onboarding/family',
    done: (profile) =>
      Boolean(text(profile?.maritalStatus) && text(profile?.housingStatus) && text(profile?.permanentAddress)),
    summary: (profile) => profile?.permanentAddress?.trim() || '',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    path: '/onboarding/contacts',
    done: (profile) =>
      Boolean(text(profile?.phone) && text(profile?.address) && text(profile?.city) && profile?.phoneVerified),
    summary: (profile) => [profile?.phone, profile?.city].filter(Boolean).join(' · '),
  },
  {
    id: 'professional',
    label: 'Profession',
    path: '/onboarding/profession',
    done: (profile) => Boolean(text(profile?.profession) && text(profile?.employer) && text(profile?.incomeSource)),
    summary: (profile) => [profile?.profession, profile?.employer].filter(Boolean).join(' · '),
  },
  {
    id: 'fatca',
    label: 'FATCA',
    path: '/onboarding/fatca',
    done: (profile) => profile?.fatcaData != null && typeof profile.fatcaData === 'object',
    summary: (profile) => {
      const data = profile?.fatcaData as { isUSPerson?: boolean } | null;
      if (!data) return '';
      return data.isUSPerson ? 'Personne américaine' : 'Pas de lien fiscal américain';
    },
  },
  {
    id: 'pep',
    label: 'Personne politiquement exposée',
    path: '/onboarding/pep',
    done: (profile) => profile?.pepData != null && typeof profile.pepData === 'object',
    summary: (profile) => {
      const data = profile?.pepData as { isPep?: boolean } | null;
      if (!data) return '';
      return data.isPep ? 'Déclaration PPE' : 'Pas une PPE';
    },
  },
  {
    id: 'card',
    label: 'Carte bancaire',
    path: '/onboarding/card',
    done: (profile) => Boolean(text(profile?.cardType)),
    summary: (profile) => labelFor(CARD_OPTIONS, profile?.cardType),
  },
];

export function nextDossierStep(profile: UserProfileRecord | null) {
  return DOSSIER_STEPS.find((step) => !step.done(profile)) ?? null;
}

export { AGENCIES };
