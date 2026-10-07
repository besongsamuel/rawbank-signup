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
        setProfile(existing);
        return existing;
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
      setProfile(created.data);
      return created.data;
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
        });
        if (updated.errors?.length || !updated.data) {
          throw new Error(messageFrom(updated.errors, 'Enregistrement impossible. Réessayez.'));
        }
        setProfile(updated.data);
        return updated.data;
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
