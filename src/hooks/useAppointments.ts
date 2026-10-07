import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { dataClient, type AppointmentRecord } from '../lib/dataClient';

const UPCOMING = new Set(['scheduled', 'rescheduled', 'checked_in', 'in_progress']);

function dateInput(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function useAppointments(clientId?: string | null) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!clientId) {
      setAppointments([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const listed = await dataClient.models.Appointment.list({
        filter: { clientId: { eq: clientId } },
      });
      if (listed.errors?.length) {
        throw new Error(listed.errors.map((item) => item.message).join(' '));
      }
      const upcoming = listed.data
        .filter((item) => item.status && UPCOMING.has(item.status))
        .sort((a, b) => `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(`${b.scheduledDate} ${b.scheduledTime}`));
      setAppointments(upcoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger vos rendez-vous.');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const book = useCallback(
    async (input: { date: Date; time: string; agencyId: string; clientName: string }) => {
      setSaving(true);
      setError('');
      try {
        const { userId } = await getCurrentUser();
        const created = await dataClient.models.Appointment.create({
          clientId: userId,
          agencyId: input.agencyId,
          scheduledDate: dateInput(input.date),
          scheduledTime: input.time,
          status: 'scheduled',
          clientName: input.clientName,
          checkInCode: String(Math.floor(100000 + Math.random() * 900000)),
        });
        if (created.errors?.length || !created.data) {
          throw new Error(created.errors?.map((item) => item.message).join(' ') || 'Réservation impossible.');
        }
        await refresh();
        return created.data;
      } catch (err) {
        const text = err instanceof Error ? err.message : 'Réservation impossible.';
        setError(text);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  const cancel = useCallback(
    async (id: string) => {
      setSaving(true);
      setError('');
      try {
        const updated = await dataClient.models.Appointment.update({ id, status: 'cancelled' });
        if (updated.errors?.length) {
          throw new Error(updated.errors.map((item) => item.message).join(' '));
        }
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Annulation impossible.');
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  const reschedule = useCallback(
    async (id: string, date: Date, time: string) => {
      setSaving(true);
      setError('');
      try {
        const updated = await dataClient.models.Appointment.update({
          id,
          scheduledDate: dateInput(date),
          scheduledTime: time,
          status: 'rescheduled',
        });
        if (updated.errors?.length) {
          throw new Error(updated.errors.map((item) => item.message).join(' '));
        }
        await refresh();
      } catch (err) {
        const text = err instanceof Error ? err.message : 'Report impossible.';
        setError(text);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  return { appointments, loading, saving, error, book, cancel, reschedule };
}
