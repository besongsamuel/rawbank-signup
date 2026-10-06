import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
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
  new PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [`${backend.storage.resources.bucket.bucketArn}/*`],
  })
);
