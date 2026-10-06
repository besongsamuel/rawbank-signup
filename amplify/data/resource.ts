import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      userType: a.enum(['client', 'clerk']),
      
      // Profile completion tracking
      profileComplete: a.boolean().default(false),
      currentStep: a.string(),
      
      // ID Document information
      idType: a.string(),
      idNumber: a.string(),
      idIssueDate: a.date(),
      idExpiryDate: a.date(),
      idImageKey: a.string(),
      
      // Personal information (extracted or manual)
      civility: a.string(),
      firstName: a.string(),
      middleName: a.string(),
      lastName: a.string(),
      birthDate: a.date(),
      birthPlace: a.string(),
      nationality: a.string(),
      gender: a.string(),
      
      // Address
      address: a.string(),
      city: a.string(),
      province: a.string(),
      country: a.string(),
      phone: a.string(),
      
      // AI extraction metadata
      extractedAt: a.datetime(),
      extractionConfirmed: a.boolean().default(false),
      
      // Clerk-specific fields
      clerkName: a.string(),
      agencyId: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  ExtractedIdData: a
    .model({
      userId: a.string().required(),
      imageKey: a.string().required(),
      idType: a.string().required(),
      
      // Extracted fields
      extractedData: a.json(),
      
      // Extraction metadata
      extractionStatus: a.string().required(),
      errorMessage: a.string(),
      confidence: a.float(),
    })
    .authorization((allow) => [allow.owner()]),

  // Appointment model
  Appointment: a
    .model({
      clientId: a.string().required(),
      clerkId: a.string(),
      applicationId: a.string(),
      
      // Scheduling
      scheduledDate: a.date().required(),
      scheduledTime: a.string().required(),
      agencyId: a.string().required(),
      
      // Status
      status: a.enum(['scheduled', 'checked_in', 'in_progress', 'completed', 'no_show', 'rescheduled', 'cancelled']),
      
      // Client prep data (for clerk)
      prepData: a.json(),
      checkInCode: a.string(),
      
      // Display fields
      clientName: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['clerk']).to(['read', 'update']),
    ]),

  // Meeting session for duration tracking
  MeetingSession: a
    .model({
      appointmentId: a.string().required(),
      clerkId: a.string().required(),
      clientId: a.string().required(),
      applicationId: a.string(),
      
      // Timestamps (server-calculated)
      startedAt: a.datetime().required(),
      endedAt: a.datetime(),
      
      // Duration (server: ended_at - started_at)
      durationMs: a.integer(),
      durationOverrideMs: a.integer(),
      
      // Outcome
      outcome: a.enum(['completed', 'no_show', 'rescheduled', 'cancelled']),
      notes: a.string(),
    })
    .authorization((allow) => [
      allow.groups(['clerk']).to(['read', 'create', 'update']),
    ]),

  // Event logging for analytics
  RdvEvent: a
    .model({
      eventType: a.string().required(),
      
      appointmentId: a.string().required(),
      meetingSessionId: a.string(),
      clientId: a.string().required(),
      clerkId: a.string(),
      applicationId: a.string(),
      
      timestamp: a.datetime().required(),
      
      // Metadata for analytics
      metadata: a.json(),
      durationMs: a.integer(),
    })
    .authorization((allow) => [
      allow.groups(['clerk']).to(['read', 'create']),
      allow.authenticated().to(['create']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
