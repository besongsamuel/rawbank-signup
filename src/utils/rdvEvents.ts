import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type RdvEventType = 
  | 'rdv.viewed'
  | 'rdv.day_agenda_opened'
  | 'rdv.prep_opened'
  | 'rdv.started'
  | 'rdv.completed'
  | 'rdv.no_show'
  | 'rdv.rescheduled'
  | 'rdv.cancelled';

interface LogEventParams {
  eventType: RdvEventType;
  appointmentId: string;
  clientId: string;
  clerkId?: string;
  meetingSessionId?: string;
  applicationId?: string;
  metadata?: Record<string, any>;
  durationMs?: number;
  expectedDurationMs?: number;
  actualDurationMs?: number;
}

export interface AppointmentMetrics {
  appointmentId: string;
  eventCount: number;
  durationMs?: number;
  expectedDurationMs: number;
  actualDurationMs?: number;
  withinSla?: boolean;
  outcome?: string;
}

const EXPECTED_MEETING_MS = 30 * 60 * 1000;

export async function logRdvEvent(params: LogEventParams) {
  try {
    const metadata = {
      ...params.metadata,
      ...(params.expectedDurationMs != null
        ? { expectedDurationMs: params.expectedDurationMs }
        : {}),
      ...(params.actualDurationMs != null
        ? { actualDurationMs: params.actualDurationMs }
        : {}),
    };

    const event = await client.models.RdvEvent.create({
      eventType: params.eventType,
      appointmentId: params.appointmentId,
      clientId: params.clientId,
      clerkId: params.clerkId,
      meetingSessionId: params.meetingSessionId,
      applicationId: params.applicationId,
      timestamp: new Date().toISOString(),
      metadata: Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : undefined,
      durationMs: params.durationMs,
    });

    console.log('RDV event logged:', params.eventType, event);
    return event;
  } catch (error) {
    console.error('Failed to log RDV event:', error);
    throw error;
  }
}

export async function createMeetingSession(
  appointmentId: string,
  clerkId: string,
  clientId: string,
  applicationId?: string
) {
  try {
    const session = await client.models.MeetingSession.create({
      appointmentId,
      clerkId,
      clientId,
      applicationId,
      startedAt: new Date().toISOString(),
    });

    await logRdvEvent({
      eventType: 'rdv.started',
      appointmentId,
      clientId,
      clerkId,
      meetingSessionId: session.data?.id,
    });

    return session.data;
  } catch (error) {
    console.error('Failed to create meeting session:', error);
    throw error;
  }
}

export async function completeMeetingSession(
  sessionId: string,
  outcome: 'completed' | 'no_show' | 'rescheduled' | 'cancelled',
  notes?: string
) {
  try {
    const endedAt = new Date().toISOString();

    // Get session to calculate duration
    const { data: session } = await client.models.MeetingSession.get({ id: sessionId });
    if (!session) throw new Error('Session not found');

    const durationMs = new Date(endedAt).getTime() - new Date(session.startedAt).getTime();

    const updated = await client.models.MeetingSession.update({
      id: sessionId,
      endedAt,
      durationMs,
      outcome,
      notes,
    });

    // Log completion event
    const eventType: RdvEventType = 
      outcome === 'completed' ? 'rdv.completed' :
      outcome === 'no_show' ? 'rdv.no_show' :
      outcome === 'rescheduled' ? 'rdv.rescheduled' :
      'rdv.cancelled';

    await logRdvEvent({
      eventType,
      appointmentId: session.appointmentId,
      clientId: session.clientId,
      clerkId: session.clerkId,
      meetingSessionId: sessionId,
      durationMs,
      metadata: { outcome, notes },
    });

    return updated.data;
  } catch (error) {
    console.error('Failed to complete meeting session:', error);
    throw error;
  }
}

function readMetadata(metadata: unknown): Record<string, unknown> {
  if (!metadata) return {};
  if (typeof metadata === 'string') {
    try {
      return JSON.parse(metadata) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof metadata === 'object') return metadata as Record<string, unknown>;
  return {};
}

export async function getAppointmentMetrics(appointmentId: string): Promise<AppointmentMetrics> {
  const { data: events, errors } = await client.models.RdvEvent.list({
    filter: { appointmentId: { eq: appointmentId } },
  });

  if (errors?.length) {
    console.error('Failed to load appointment events:', errors);
  }

  const completion = [...(events ?? [])].reverse().find((event) =>
    event.eventType === 'rdv.completed' ||
    event.eventType === 'rdv.no_show' ||
    event.eventType === 'rdv.rescheduled' ||
    event.eventType === 'rdv.cancelled'
  );

  const metadata = readMetadata(completion?.metadata);
  const durationMs = completion?.durationMs ?? undefined;
  const expectedDurationMs =
    typeof metadata.expectedDurationMs === 'number'
      ? metadata.expectedDurationMs
      : EXPECTED_MEETING_MS;
  const actualDurationMs =
    typeof metadata.actualDurationMs === 'number'
      ? metadata.actualDurationMs
      : durationMs;

  return {
    appointmentId,
    eventCount: events?.length ?? 0,
    durationMs,
    expectedDurationMs,
    actualDurationMs,
    withinSla: actualDurationMs != null ? actualDurationMs <= expectedDurationMs : undefined,
    outcome: typeof metadata.outcome === 'string' ? metadata.outcome : completion?.eventType ?? undefined,
  };
}
