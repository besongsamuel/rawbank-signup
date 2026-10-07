import { useCallback, useEffect, useState } from 'react';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

export const APPLICATION_SUBMITTED_KEY = 'applicationSubmitted';

export const ID_TYPE_OPTIONS = [
  { value: 'passport', label: 'Passeport' },
  { value: 'nationalId', label: "Carte d'identité" },
  { value: 'voterCard', label: "Carte d'électeur" },
  { value: 'driverLicense', label: 'Permis de conduire' },
] as const;

export const CITY_OPTIONS = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani'] as const;

export const COUNTRY_CODE = '+243';
export const LOCAL_PHONE_LENGTH = 9;

export type IdType = (typeof ID_TYPE_OPTIONS)[number]['value'];

export interface IdentityDraft {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  idNumber: string;
}

export interface ContactDraft {
  phone: string;
  address: string;
  city: string;
}

export interface ApplicationDraft {
  identity: IdentityDraft;
  contact: ContactDraft;
  idType: IdType | '';
}

const emptyIdentity = (): IdentityDraft => ({
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  idNumber: '',
});

function readJson<T>(key: string): Partial<T> | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function isIdType(value: string): value is IdType {
  return ID_TYPE_OPTIONS.some((option) => option.value === value);
}

export function idTypeLabel(value: string) {
  return ID_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

export function toLocalDigits(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('243')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, LOCAL_PHONE_LENGTH);
}

export function formatLocalPhone(digits: string) {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean).join(' ');
}

export function formatPhoneDisplay(digits: string) {
  const local = formatLocalPhone(digits);
  return local ? `${COUNTRY_CODE} ${local}` : '';
}

export function formatBirthDate(value: string) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function isApplicationSubmitted() {
  return localStorage.getItem(APPLICATION_SUBMITTED_KEY) === 'true';
}

export function markApplicationSubmitted() {
  localStorage.setItem(APPLICATION_SUBMITTED_KEY, 'true');
}

export function readApplicationDraft(): ApplicationDraft {
  const identity = readJson<IdentityDraft>('extractedData');
  const contact = readJson<ContactDraft & { phone: string }>('remainingInfo');
  const storedType = localStorage.getItem('idType') ?? '';

  return {
    identity: { ...emptyIdentity(), ...identity },
    contact: {
      phone: toLocalDigits(contact?.phone ?? ''),
      address: contact?.address ?? '',
      city: contact?.city || 'Kinshasa',
    },
    idType: isIdType(storedType) ? storedType : '',
  };
}

export function saveApplicationDraft(draft: ApplicationDraft) {
  localStorage.setItem('extractedData', JSON.stringify(draft.identity));
  localStorage.setItem(
    'remainingInfo',
    JSON.stringify({
      phone: `${COUNTRY_CODE}${draft.contact.phone}`,
      address: draft.contact.address,
      city: draft.contact.city,
    })
  );
  if (draft.idType) {
    localStorage.setItem('idType', draft.idType);
  }
}

export function useApplicationDraft() {
  const [draft, setDraft] = useState<ApplicationDraft>(readApplicationDraft);
  const [email, setEmail] = useState('');
  const [emailReady, setEmailReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchUserAttributes().catch(() => ({ email: undefined })),
      getCurrentUser().catch(() => null),
    ])
      .then(([attributes, currentUser]) => {
        if (!active) return;
        const loginId = currentUser?.signInDetails?.loginId;
        setEmail(attributes.email || loginId || '');
      })
      .finally(() => {
        if (active) setEmailReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((next: ApplicationDraft) => {
    saveApplicationDraft(next);
    setDraft(next);
  }, []);

  return { draft, email, emailReady, save };
}
