import { defineFunction, secret } from '@aws-amplify/backend';

export const extractIdData = defineFunction({
  name: 'extract-id-data',
  entry: './handler.ts',
  environment: {
    OPENAI_API_KEY: secret('OPENAI_API_KEY'),
  },
  timeoutSeconds: 60,
});
