import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { useCallback, useEffect, useState } from 'react';
import { dataClient, type UserProfileRecord } from '../lib/dataClient';

export type ProfilePatch = Partial<
  Pick<
    UserProfileRecord,
    | 'currentStep'
    | 'profileComplete'
    | 'idType'
    | 'idNumber'
    | 'idImageKey'
    | 'firstName'
    | 'middleName'
    | 'lastName'
    | 'birthDate'
    | 'address'
    | 'city'
    | 'phone'
    | 'phone2'
    | 'phoneVerified'
    | 'emergencyContactName'
    | 'emergencyContactPhone'
    | 'accountType'
    | 'agencyId'
    | 'cardType'
    | 'maritalStatus'
    | 'maritalRegime'
    | 'numberOfChildren'
    | 'housingStatus'
    | 'permanentAddress'
    | 'mailingAddress'
    | 'profession'
    | 'employer'
    | 'monthlyIncome'
    | 'incomeSource'
    | 'extractionConfirmed'
  >
> & {
  fatcaData?: Record<string, unknown> | null;
  pepData?: Record<string, unknown> | null;
};

function messageFrom(errors: { message: string }[] | undefined, fallback: string) {
  return errors?.map((error) => error.message).filter(Boolean).join(' ') || fallback;
}

function jsonForApi(value: unknown) {
  if (value == null || typeof value === 'string') return value;
  return JSON.stringify(value);
}

function jsonFromApi(value: unknown): Record<string, unknown> | null {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  if (typeof value === 'object') return value as Record<string, unknown>;
  return null;
}

function withReadableJson(record: UserProfileRecord): UserProfileRecord {
  return {
    ...record,
    fatcaData: jsonFromApi(record.fatcaData) as UserProfileRecord['fatcaData'],
    pepData: jsonFromApi(record.pepData) as UserProfileRecord['pepData'],
  };
}

async function currentEmail(userId: string) {
  const user = await getCurrentUser();
  const loginId = user.signInDetails?.loginId;
  if (loginId) return loginId;
  const attributes = await fetchUserAttributes().catch(() => ({ email: undefined }));
  return attributes.email || `${userId}@clients.rawbank`;
}

export function useAmplifyProfile() {
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { userId } = await getCurrentUser();
      const listed = await dataClient.models.UserProfile.list({
        filter: { userId: { eq: userId } },
      });
      if (listed.errors?.length) {
        throw new Error(messageFrom(listed.errors, 'Impossible de charger votre dossier.'));
      }
      const existing = listed.data[0];
      if (existing) {
        const readable = withReadableJson(existing);
        setProfile(readable);
        return readable;
      }
      const email = await currentEmail(userId);
      const created = await dataClient.models.UserProfile.create({
        userId,
        email,
        userType: 'client',
        currentStep: 'account',
      });
      if (created.errors?.length || !created.data) {
        throw new Error(messageFrom(created.errors, 'Impossible de créer votre dossier.'));
      }
      const readable = withReadableJson(created.data);
      setProfile(readable);
      return readable;
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Impossible de charger votre dossier.';
      setError(text);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (patch: ProfilePatch) => {
      setSaving(true);
      setError('');
      try {
        const current = profile ?? (await load());
        if (!current?.id) {
          throw new Error('Votre dossier n’est pas encore prêt. Réessayez.');
        }
        const updated = await dataClient.models.UserProfile.update({
          id: current.id,
          ...patch,
          ...('fatcaData' in patch ? { fatcaData: jsonForApi(patch.fatcaData) } : {}),
          ...('pepData' in patch ? { pepData: jsonForApi(patch.pepData) } : {}),
        });
        if (updated.errors?.length || !updated.data) {
          throw new Error(messageFrom(updated.errors, 'Enregistrement impossible. Réessayez.'));
        }
        const readable = withReadableJson(updated.data);
        setProfile(readable);
        return readable;
      } catch (err) {
        const text = err instanceof Error ? err.message : 'Enregistrement impossible. Réessayez.';
        setError(text);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [load, profile]
  );

  return { profile, loading, saving, error, save, reload: load };
}
