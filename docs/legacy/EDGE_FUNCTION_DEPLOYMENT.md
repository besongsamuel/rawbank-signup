# Edge Function Deployment Guide

## 🚀 Deploying `extract-id-data` Edge Function

### Prerequisites

1. **Supabase CLI** installed
   ```bash
   npm install -g supabase
   ```

2. **Docker Desktop** (for local testing)
   - Download from: https://www.docker.com/products/docker-desktop
   - Required for `supabase functions serve`

3. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Required for the GPT-4 Vision API

---

## 📝 Environment Variables

### Create `.env` file for edge function:

Create `supabase/.env` (git-ignored):

```bash
# Supabase Configuration
SUPABASE_URL=https://ygtguyvvzfwcijahjqwy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGd1eXZ2emZ3Y2lqYWhqcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDkzMTYsImV4cCI6MjA3NTkyNTMxNn0.T0MIx0evLj7jgm67z-SEXJ9ox0w5tJSc-anBL7sypqA

# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=sk-proj-...your-key-here...
```

---

## 🧪 Local Testing

### 1. Start Supabase Services

```bash
cd /Users/besongsamuel/Documents/Github/rawbank-signup
npx supabase start
```

This starts:
- PostgreSQL database
- Auth service
- Storage service
- Edge Functions runtime

### 2. Serve Edge Function Locally

```bash
npx supabase functions serve extract-id-data --env-file supabase/.env --no-verify-jwt
```

The function will be available at:
```
http://localhost:54321/functions/v1/extract-id-data
```

### 3. Test with cURL

```bash
# Get a test token
export ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGd1eXZ2emZ3Y2lqYWhqcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDkzMTYsImV4cCI6MjA3NTkyNTMxNn0.T0MIx0evLj7jgm67z-SEXJ9ox0w5tJSc-anBL7sypqA"

# Test the function
curl -X POST \
  http://localhost:54321/functions/v1/extract-id-data \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://your-test-image-url.jpg",
    "idType": "passport"
  }'
```

---

## 🌐 Production Deployment

### 1. Login to Supabase

```bash
npx supabase login
```

This will open a browser for authentication.

### 2. Link to Project

```bash
cd /Users/besongsamuel/Documents/Github/rawbank-signup
npx supabase link --project-ref ygtguyvvzfwcijahjqwy
```

### 3. Set Secrets

Set the OpenAI API key as a secret (more secure than .env):

```bash
npx supabase secrets set OPENAI_API_KEY=sk-proj-...your-key-here...
```

You can also set other secrets:

```bash
npx supabase secrets set SUPABASE_URL=https://ygtguyvvzfwcijahjqwy.supabase.co
npx supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Deploy the Function

```bash
npx supabase functions deploy extract-id-data
```

This will:
- Bundle the TypeScript code
- Upload to Supabase
- Make it available at the production URL

### 5. Verify Deployment

```bash
# List all functions
npx supabase functions list

# Check function logs
npx supabase functions logs extract-id-data
```

### 6. Test Production Endpoint

```bash
curl -X POST \
  https://ygtguyvvzfwcijahjqwy.supabase.co/functions/v1/extract-id-data \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://your-storage-url.jpg",
    "idType": "passport"
  }'
```

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Real-time logs
npx supabase functions logs extract-id-data --follow

# Last 100 logs
npx supabase functions logs extract-id-data --limit 100
```

### Common Issues

#### 1. **Docker not running**
```
Error: Docker daemon is not running
```
**Solution**: Start Docker Desktop

#### 2. **Missing OpenAI API Key**
```
Error: OPENAI_API_KEY is not set
```
**Solution**: Set the secret or .env file

#### 3. **CORS errors**
```
Access-Control-Allow-Origin error
```
**Solution**: Check CORS headers in the edge function code (already configured)

#### 4. **Invalid image URL**
```
Error: Failed to fetch image
```
**Solution**: Ensure the image URL is publicly accessible or use Supabase presigned URLs

#### 5. **Database connection error**
```
Error: relation "extracted_user_data" does not exist
```
**Solution**: Apply the migration first (see `APPLY_MIGRATION_INSTRUCTIONS.md`)

---

## 🔐 Security Best Practices

### 1. **Use Secrets for API Keys**

Never commit API keys to git. Use Supabase secrets:

```bash
npx supabase secrets set OPENAI_API_KEY=sk-...
```

### 2. **Verify JWT Tokens**

In production, remove `--no-verify-jwt` flag. The edge function will verify user authentication.

### 3. **Rate Limiting**

Consider adding rate limiting to prevent abuse:

```typescript
// In edge function
const MAX_REQUESTS_PER_HOUR = 10;

const { data: recentRequests } = await supabase
  .from('extraction_requests')
  .select('count')
  .eq('user_id', userId)
  .gte('created_at', new Date(Date.now() - 3600000).toISOString());

if (recentRequests?.length >= MAX_REQUESTS_PER_HOUR) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

### 4. **Storage RLS Policies**

Ensure the `ids` bucket has proper RLS policies so users can only access their own images.

---

## 📊 Cost Monitoring

### OpenAI API Costs

- **GPT-4 Vision**: ~$0.01 per image
- Monitor at: https://platform.openai.com/usage

### Supabase Costs

- **Edge Functions**: First 500K requests free
- **Storage**: First 1GB free
- Monitor at: https://supabase.com/dashboard/project/ygtguyvvzfwcijahjqwy/settings/billing

---

## 🔄 Update Workflow

When you update the edge function:

```bash
# 1. Test locally
npx supabase functions serve extract-id-data

# 2. Deploy to production
npx supabase functions deploy extract-id-data

# 3. Check logs for errors
npx supabase functions logs extract-id-data --follow

# 4. If issues, rollback or redeploy with fixes
```

---

## 📚 References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy](https://deno.com/deploy)
- [OpenAI API Docs](https://platform.openai.com/docs/guides/vision)

---

## ✅ Deployment Checklist

### Local Testing
- [ ] Docker Desktop is running
- [ ] Created `supabase/.env` with OpenAI API key
- [ ] Started Supabase: `npx supabase start`
- [ ] Served function: `npx supabase functions serve`
- [ ] Tested with cURL or Postman
- [ ] Verified data saved to `extracted_user_data` table

### Production Deployment
- [ ] Logged in: `npx supabase login`
- [ ] Linked project: `npx supabase link`
- [ ] Applied migration (created `extracted_user_data` table)
- [ ] Set OpenAI secret: `npx supabase secrets set`
- [ ] Deployed function: `npx supabase functions deploy`
- [ ] Tested production endpoint
- [ ] Monitored logs for errors
- [ ] Verified data in production database

### Post-Deployment
- [ ] Test full user flow (upload → extract → confirm)
- [ ] Monitor OpenAI API usage
- [ ] Check Supabase billing
- [ ] Set up alerting for errors
- [ ] Document any issues encountered

---

**Current Status**: 
- ✅ Edge function code updated
- ⏳ Local testing (requires Docker)
- ⏳ Production deployment (requires secrets)

**Next Step**: Apply the migration, then deploy!

