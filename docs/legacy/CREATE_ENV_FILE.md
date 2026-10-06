# Create Edge Function Environment File

## 📝 Required Environment Variables

Create the file: `supabase/functions/.env`

```bash
# Supabase Edge Function Environment Variables

# Supabase Configuration
SUPABASE_URL=https://ygtguyvvzfwcijahjqwy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGd1eXZ2emZ3Y2lqYWhqcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDkzMTYsImV4cCI6MjA3NTkyNTMxNn0.T0MIx0evLj7jgm67z-SEXJ9ox0w5tJSc-anBL7sypqA

# OpenAI API Key (REQUIRED for ID extraction)
# Get your API key from: https://platform.openai.com/api-keys
# Replace with your actual OpenAI API key
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

## 🚀 Quick Setup Commands

Run these commands to create the file:

```bash
cd /Users/besongsamuel/Documents/Github/rawbank-signup

# Create the .env file
cat > supabase/functions/.env << 'EOF'
# Supabase Edge Function Environment Variables

# Supabase Configuration
SUPABASE_URL=https://ygtguyvvzfwcijahjqwy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGd1eXZ2emZ3Y2lqYWhqcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDkzMTYsImV4cCI6MjA3NTkyNTMxNn0.T0MIx0evLj7jgm67z-SEXJ9ox0w5tJSc-anBL7sypqA

# OpenAI API Key (REQUIRED for ID extraction)
# Get your API key from: https://platform.openai.com/api-keys
# Replace with your actual OpenAI API key
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
EOF

# Verify the file was created
ls -la supabase/functions/.env
```

## ⚠️ Important Notes

1. **Replace the OpenAI API Key**:

   - Get your key from: https://platform.openai.com/api-keys
   - Replace `sk-proj-your-openai-api-key-here` with your actual key

2. **Security**:

   - The `.env` file is git-ignored
   - Never commit API keys to version control

3. **Production**:
   - For production deployment, use Supabase secrets:
   ```bash
   npx supabase secrets set OPENAI_API_KEY=your-actual-key
   ```

## 🧪 Test the Edge Function

After creating the `.env` file:

```bash
# The function should already be running at:
# http://127.0.0.1:54321/functions/v1/extract-id-data

# Test with a sample request
curl -X POST \
  http://127.0.0.1:54321/functions/v1/extract-id-data \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndGd1eXZ2emZ3Y2lqYWhqcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDkzMTYsImV4cCI6MjA3NTkyNTMxNn0.T0MIx0evLj7jgm67z-SEXJ9ox0w5tJSc-anBL7sypqA" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/sample-id.jpg",
    "idType": "passport"
  }'
```

## 🔍 Current Status

✅ **Edge function is running locally** at:

- URL: `http://127.0.0.1:54321/functions/v1/extract-id-data`
- Runtime: supabase-edge-runtime-1.69.12
- Deno version: v2.1.4

⏳ **Next steps**:

1. Create the `.env` file with your OpenAI API key
2. Test the function with a real ID image
3. Apply the `extracted_user_data` migration
4. Deploy to production
