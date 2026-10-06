import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { extractIdData } from './functions/extract-id-data/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  extractIdData,
});

// Grant storage access to the extract-id-data function
backend.extractIdData.resources.lambda.addToRolePolicy(
  new backend.constructFactory.iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [`${backend.storage.resources.bucket.bucketArn}/*`],
  })
);
