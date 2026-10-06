import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      
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
      
      // FATCA
      fatcaApplicable: a.boolean().default(false),
      fatcaCompleted: a.boolean().default(false),
      fatcaData: a.json(),
      
      // PEP
      pepCompleted: a.boolean().default(false),
      pepData: a.json(),
      
      // Account selection
      accountType: a.string(),
      cardType: a.string(),
      
      // AI extraction metadata
      extractedAt: a.datetime(),
      extractionConfirmed: a.boolean().default(false),
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
