# Rawbank - AI-First Online Account Opening

Modern, mobile-first proof-of-concept for Rawbank online account opening, powered by AWS Amplify Gen 2 + OpenAI Vision.

## 🎯 Overview

This application demonstrates a streamlined, AI-first approach to bank account opening for Rawbank (DRC). Two personas in one app:

1. **Client** (priority): 7-screen AI-first signup flow
2. **Clerk/RDV** (demoable): 5-screen in-agency appointment handling

### Key Features

- **AI-First**: OpenAI Vision (GPT-4o) extracts data from ID documents
- **Dual Personas**: Client signup + Clerk RDV management via Cognito groups
- **Mobile-First**: Optimized for phone with sticky 52px CTAs
- **AWS Amplify Gen 2**: Backend-as-code with Cognito, DynamoDB, S3, Lambda
- **French Primary**: FR/EN i18n support with language toggle

## 🏗️ Architecture

### Frontend
- **Vite** + React 19 + TypeScript
- **Material-UI** (custom Rawbank theme: `#FFCC00` / `#0A0A0A`)
- **AWS Amplify** client libraries (v6)
- **i18next** for FR/EN localization

### Backend (Amplify Gen 2)
- **Auth**: Amazon Cognito (email/password, groups: `client` | `clerk`)
- **Data**: DynamoDB via Amplify Data schema (5 models)
- **Storage**: S3 for ID document images (identity-scoped access)
- **Function**: Lambda for AI ID extraction (OpenAI gpt-4o)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **AWS account** (for Amplify sandbox - free tier OK)
- **OpenAI API key** (for ID extraction)

### Step-by-Step Setup

#### 1. Clone and Install

```bash
git clone <repo-url>
cd rawbank-signup
npm install
```

This installs both frontend dependencies and Amplify CLI.

#### 2. Configure OpenAI Secret

The Lambda function needs your OpenAI API key. Set it via Amplify sandbox secrets:

```bash
npx ampx sandbox secret set OPENAI_API_KEY
```

You'll be prompted to enter your OpenAI API key (starts with `sk-`). This is stored securely in AWS Secrets Manager (sandbox environment).

To verify:
```bash
npx ampx sandbox secret list
```

#### 3. Start Amplify Sandbox

In **Terminal 1**, start the Amplify sandbox backend:

```bash
npm run sandbox
# Or: npx ampx sandbox
```

**What happens:**
- Deploys Cognito user pool (auth)
- Creates DynamoDB tables (data models)
- Creates S3 bucket (ID document storage)
- Deploys Lambda function (AI extraction)
- Generates `amplify_outputs.json` (auto-wired by frontend)

**Wait for:** `✅ Sandbox deployed` message (~2-3 min first time, faster on subsequent runs).

The sandbox stays running and hot-reloads on backend changes.

#### 4. Start Dev Server

In **Terminal 2**, start the Vite dev server:

```bash
npm run dev
```

The app opens at `http://localhost:3000`.

### Testing the App

#### Client Flow (7 Screens)

1. Visit `http://localhost:3000/`
2. Click **"Continuer"** → **"S'inscrire"**
3. Sign up with email + password
4. **ID Upload**: Select document type → upload photo
5. **Extracting**: Watch AI extraction (simulated 3s for demo)
6. **Confirm**: Review/edit extracted data
7. **Remaining**: Complete phone, address
8. **Verify**: Enter OTP (mock: any 6 digits)
9. **Success**: See confirmation screen

#### Clerk Flow (5 Screens)

Navigate to `http://localhost:3000/clerk/calendar`:

1. **Aujourd'hui**: See 3 seeded appointments
2. Tap an appointment → **Détail RDV**: Review AI prep card
3. Click **"Démarrer l'entretien"** → Timer starts
4. Click **"Terminer l'entretien"** → **Clôture**: Select outcome
5. See auto-calculated duration + save

**Language Toggle**: Click 🌐 icon in header to switch FR ↔ EN.

### Environment Variables

Create `.env` (gitignored) for local overrides if needed:

```bash
cp .env.example .env
```

**Important:** 
- Do **NOT** put `OPENAI_API_KEY` in `.env` (use `ampx sandbox secret` instead)
- Amplify config is in `amplify_outputs.json` (auto-generated, gitignored)
- No manual AWS credentials needed for sandbox

## 📱 User Flow

### Client Path (7 Screens)

1. **Welcome**: Brand intro, CTA to continue
2. **Auth**: Cognito sign-up or sign-in
3. **ID Upload** (Step 1/7): Select ID type → upload photo
4. **Extracting**: Full-screen AI extraction with progress
5. **Confirm** (Step 2/7): Review and edit extracted data
6. **Remaining** (Step 3/7): Fill gaps (phone, address, city)
7. **OTP Verify** (Step 4/7): Phone number verification
8. **Success**: Confirmation and next steps

### Clerk Path (5 Screens)

1. **Aujourd'hui**: Day agenda with status-coded appointments
2. **Détail RDV**: Client info + AI-extracted data review
3. **Rencontre en cours**: Live meeting timer
4. **Clôture**: Complete meeting with auto-calculated duration
5. **Semaine**: Week view (scaffolded, not implemented)

**Fallback**: If AI extraction fails, user can enter data manually.

## 🎨 Design System

### Visual

- **Colors**: Black (`#0A0A0A`) + Yellow (`#FFCC00`)
- **CTA**: Black background + yellow label (52px height)
- **Typography**: System UI stack, ~17px body, sentence case
- **Progress**: Thin yellow bar "Étape n sur 7"
- **Radius**: 12-16px, soft shadows

### Motion (Simple + Alive)

- **Page enter**: Fade + 8px rise (200ms)
- **CTA press**: `scale(0.98)`
- **Extracting**: Breath pulse on AI icon
- **Confirm**: Yellow claw flash
- All animations honor `prefers-reduced-motion`

## 🔧 Development

### Project Structure

```
rawbank-signup/
├── amplify/                    # Amplify Gen 2 backend (committed)
│   ├── auth/resource.ts        # Cognito configuration
│   ├── data/resource.ts        # DynamoDB schema (5 models)
│   ├── storage/resource.ts     # S3 configuration
│   ├── functions/
│   │   └── extract-id-data/    # Lambda + OpenAI Vision
│   ├── backend.ts              # Backend composition
│   ├── package.json            # Amplify dependencies
│   └── tsconfig.json           # Amplify TypeScript config
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route pages (client + clerk)
│   ├── utils/                  # Utilities (event logging, etc.)
│   ├── theme.ts                # MUI Rawbank theme
│   ├── i18n.ts                 # FR/EN translations
│   └── App.tsx                 # Main app + routing
├── plans/                      # UX/product specs
│   ├── rawbank-signup-ux-refresh.md
│   └── rawbank-clerk-rdv-ux.md
├── docs/legacy/                # Old Supabase docs (archived)
├── package.json                # Frontend + scripts
├── vite.config.ts              # Vite configuration
├── .env.example                # Environment template
├── .gitignore                  # Ignores amplify_outputs.json
└── README.md                   # This file
```

### Key Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Amplify Backend
npm run sandbox          # Start Amplify sandbox
npm run sandbox:secret   # Manage sandbox secrets
npm run deploy           # Deploy to AWS (production)

# Secrets Management
npx ampx sandbox secret set OPENAI_API_KEY      # Set secret
npx ampx sandbox secret list                    # List secrets
npx ampx sandbox secret remove OPENAI_API_KEY   # Remove secret
```

### Data Models

**5 DynamoDB tables via Amplify Data:**

1. **UserProfile**: Client/clerk user data
2. **ExtractedIdData**: AI extraction results
3. **Appointment**: Scheduled meetings (clerk)
4. **MeetingSession**: Meeting duration tracking
5. **RdvEvent**: Analytics event logs

See `amplify/data/resource.ts` for full schema.

### AI Extraction

The Lambda function (`amplify/functions/extract-id-data/handler.ts`) calls OpenAI Vision API:

- **Model**: `gpt-4o`
- **Input**: Presigned S3 URL of ID image
- **Output**: JSON with extracted fields (name, birth date, ID number, etc.)
- **Fallback**: Manual entry if extraction fails

## 🧪 Testing

### Manual Testing Checklist

**Client Flow:**
- [ ] Sign up with new email
- [ ] Upload ID image (passport, national ID, etc.)
- [ ] Watch AI extraction animation
- [ ] Confirm/edit extracted data
- [ ] Complete remaining info
- [ ] Verify phone (mock: any 6 digits)
- [ ] See success screen

**Clerk Flow:**
- [ ] Navigate to `/clerk/calendar`
- [ ] View seeded appointments
- [ ] Open appointment detail
- [ ] Start meeting (timer)
- [ ] Complete meeting
- [ ] Verify duration auto-calculated

**Internationalization:**
- [ ] Toggle language FR ↔ EN
- [ ] Verify all UI strings translate
- [ ] Verify proper sentence case

**Responsive:**
- [ ] Test on mobile viewport
- [ ] Verify sticky bottom CTAs
- [ ] Check 420px max width on desktop

### Troubleshooting

**"Sandbox failed to deploy"**
- Check AWS credentials: `aws sts get-caller-identity`
- Ensure region is set: `export AWS_REGION=us-east-1`
- Try: `npx ampx sandbox --profile default`

**"OpenAI API error"**
- Verify secret is set: `npx ampx sandbox secret list`
- Check OpenAI API key is valid: https://platform.openai.com/api-keys
- Ensure you have API credits

**"Cannot read amplify_outputs.json"**
- Ensure sandbox is running: `npm run sandbox`
- Check file exists: `ls amplify_outputs.json`
- Restart dev server: `npm run dev`

**"Upload failed"**
- Ensure sandbox deployed successfully
- Check browser console for CORS errors
- Verify Cognito session exists (sign in first)

## 🚀 Deployment

### Production Deployment to AWS

1. **Configure AWS credentials**:
```bash
npx ampx configure aws
```

2. **Set production secrets**:
```bash
npx ampx secret set OPENAI_API_KEY --environment production
```

3. **Deploy**:
```bash
npm run deploy
# Or: npx ampx deploy
```

4. **Build frontend**:
```bash
npm run build
```

5. **Host frontend**:
- Upload `dist/` to AWS Amplify Hosting
- Or use S3 + CloudFront
- Or any static host (Vercel, Netlify, etc.)

### CI/CD

Add to GitHub Actions / GitLab CI:

```yaml
- run: npm install
- run: npm run build
- run: npx ampx deploy --environment production
```

## 📋 Implementation Notes

### What Changed from Supabase

- **Backend**: Supabase → AWS Amplify Gen 2 (Cognito, DynamoDB, S3, Lambda)
- **Build**: Create React App → Vite
- **Flow**: 9-step stepper → 7-screen linear flow
- **Theme**: Refined to locked UX spec (black CTA + yellow label)
- **Removed**: FATCA, PEP, marital, professional, card/agency selection (not in POC happy path)

### Why Amplify Gen 2?

- **Backend-as-code**: Full TypeScript backend in repo
- **Greenfield**: No legacy data to migrate
- **AWS native**: Cognito, DynamoDB, S3, Lambda integration
- **Sandbox**: Fast local dev without manual AWS setup
- **Type safety**: Full TypeScript client SDKs

### Mobile-First

- Max content width: 420px (centered on desktop)
- Sticky bottom CTAs: 52px height, fixed on mobile
- Touch-friendly: 48px+ tap targets
- Progressive: Can be installed as PWA

## 📚 Documentation

- **Client UX Spec**: `plans/rawbank-signup-ux-refresh.md`
- **Clerk UX Spec**: `plans/rawbank-clerk-rdv-ux.md`
- **Legacy Supabase Docs**: `docs/legacy/` (archived)
- **Amplify Gen 2 Docs**: https://docs.amplify.aws/gen2/

## 🤝 Contributing

This is a proof-of-concept. For production:

- Add real Cognito email verification
- Implement actual OTP via SNS
- Connect Lambda to real ID verification APIs
- Add comprehensive error handling
- Implement proper logging and monitoring
- Add unit and E2E tests

## 📄 License

Private - Rawbank Internal POC

---

**Built with**: React 19, TypeScript, AWS Amplify Gen 2, Material-UI, OpenAI Vision  
**For**: Rawbank (Democratic Republic of Congo)  
**Date**: October 2026
