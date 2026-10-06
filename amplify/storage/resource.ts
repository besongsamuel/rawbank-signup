import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'rawbank-id-documents',
  access: (allow) => ({
    'id-documents/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
});
