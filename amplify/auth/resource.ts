import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Vérifiez votre compte Rawbank',
      verificationEmailBody: (createCode) =>
        `Bienvenue chez Rawbank! Votre code de vérification est: ${createCode()}`,
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: false,
    },
    givenName: {
      required: false,
      mutable: true,
    },
    familyName: {
      required: false,
      mutable: true,
    },
  },
  groups: ['client', 'clerk'],
});
