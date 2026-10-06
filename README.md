# Rawbank - AI-First Online Account Opening

Modern, mobile-first proof-of-concept for Rawbank online account opening, powered by AWS Amplify Gen 2 + OpenAI Vision.

## 🎯 Overview

This application demonstrates a streamlined, AI-first approach to bank account opening for Rawbank (DRC). Users upload their ID, AI extracts the data, and they complete the process in under 5 minutes.

### Key Features

- **AI-First**: OpenAI Vision (GPT-4o) extracts data from ID documents
- **7-Screen Flow**: Welcome → Auth → ID Upload → Extracting → Confirm → Complete → Verify → Success
- **Mobile-First**: Optimized for phone with sticky 52px CTAs and thumb-friendly UI
- **AWS Amplify Gen 2**: Backend-as-code with Cognito, DynamoDB, S3, and Lambda
- **French Primary**: FR/EN i18n support

## 🏗️ Architecture

### Frontend
- **Vite** + React 19 + TypeScript
- **Material-UI** (custom Rawbank theme: `#FFCC00` / `#000000`)
- **AWS Amplify** client libraries
- **i18next** for localization

### Backend (Amplify Gen 2)
- **Auth**: Amazon Cognito (email/password)
- **Data**: DynamoDB via Amplify Data schema
- **Storage**: S3 for ID document images
- **Function**: Lambda for AI ID extraction (OpenAI gpt-4o)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS account (for Amplify sandbox)
- OpenAI API key (for ID extraction)

### Local Development

1. **Clone and install**:
```bash
git clone <repo-url>
cd rawbank-signup
npm install
```

2. **Configure OpenAI secret**:
```bash
npx ampx sandbox secret set OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

3. **Start Amplify sandbox** (in one terminal):
```bash
npx ampx sandbox
```

Wait for the sandbox to deploy (~2-3 minutes first time). It will generate `amplify_outputs.json`.

4. **Start dev server** (in another terminal):
```bash
npm run dev
```

The app will open at `http://localhost:3000`.

### Environment Variables

Create `.env` (gitignored) for local overrides if needed. The Amplify sandbox handles AWS config via `amplify_outputs.json`.

See `.env.example` for reference (no secrets required locally beyond OpenAI key in Amplify).

## 📱 User Flow

### 7-Screen Onboarding

1. **Welcome**: Brand intro, CTA to continue
2. **Auth**: Cognito sign-up or sign-in (required for S3 upload)
3. **ID Upload** (Step 1/7): Select ID type → upload photo
4. **Extracting**: Full-screen AI extraction with progress
5. **Confirm** (Step 2/7): Review and edit extracted data
6. **Remaining** (Step 3/7): Fill gaps (phone, address, city)
7. **OTP Verify** (Step 4/7): Phone number verification
8. **Success**: Confirmation and next steps

### Fallback Flow

If AI extraction fails or user prefers manual entry:
- Skip directly to "Remaining" screen (all fields empty)
- Complete form manually
- Continue to verification

## 🎨 Design System

### Visual

- **Colors**: Black (`#000000`) + Yellow (`#FFCC00`)
- **CTA**: Black background + yellow label (52px height)
- **Typography**: System UI stack, ~17px body, sentence case
- **Progress**: Thin yellow bar "Étape n sur 7"
- **Radius**: 12-16px, soft shadows

### Motion (Simple + Alive)

- **Page enter**: Fade + 8px rise (200ms)
- **CTA press**: `scale(0.98)`
- **Extracting**: Breath pulse on AI icon
- **Confirm success**: Yellow claw flash
- **Welcome logo**: Subtle 5s breath

All animations honor `prefers-reduced-motion`.

## 🔧 Development

### Project Structure

```
rawbank-signup/
├── amplify/                    # Amplify Gen 2 backend
│   ├── auth/                   # Cognito configuration
│   ├── data/                   # DynamoDB schema
│   ├── storage/                # S3 configuration
│   └── functions/              # Lambda functions
│       └── extract-id-data/    # OpenAI Vision extraction
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route pages (7 screens)
│   ├── theme.ts                # MUI Rawbank theme
│   ├── i18n.ts                 # FR/EN translations
│   └── App.tsx                 # Main app + routing
├── plans/                      # UX/product specs
└── docs/legacy/                # Old Supabase docs (archived)
```

### Key Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npx ampx sandbox     # Start Amplify sandbox (backend)
```

### Amplify Deployment

For production deployment to AWS:

1. **Link repo to Amplify Hosting**:
```bash
npx ampx configure aws
npx ampx deploy
```

2. **Set secrets in AWS**:
```bash
npx ampx secret set OPENAI_API_KEY --environment production
```

3. **Enable CI/CD** via AWS Console or `amplify.yml`

## 📋 Implementation Notes

### What Changed from Supabase

- **Backend**: Supabase → AWS Amplify Gen 2 (Cognito, DynamoDB, S3, Lambda)
- **Build**: Create React App → Vite
- **Flow**: 9-step stepper → 7-screen linear flow
- **Theme**: Refined to locked UX spec (black CTA + yellow label)
- **Removed**: FATCA, PEP, marital, professional, card/agency selection (not in POC happy path)

### AI Extraction

The Lambda function (`amplify/functions/extract-id-data/handler.ts`) calls OpenAI Vision API with:

- Model: `gpt-4o`
- Prompt: Extract structured data from DRC ID documents
- Output: JSON with firstName, middleName, lastName, birthDate, idNumber, etc.

On success, data flows to Confirm screen for user review. On failure, user continues with manual entry.

### Mobile-First

- Max content width: 420px (centered on desktop)
- Sticky bottom CTAs: 52px height, fixed on mobile
- Touch-friendly: 48px+ tap targets, generous spacing
- Progressive: Can be installed as PWA

## 🧪 Testing

Run the full flow:

1. Visit `/` (Welcome)
2. Sign up with test email
3. Upload a sample ID image
4. Watch AI extraction (simulated for now)
5. Confirm/edit extracted data
6. Complete remaining info
7. Enter OTP (mock verification)
8. See success screen

## 📚 Documentation

- **UX Spec**: `/workspace/plans/rawbank-signup-ux-refresh.md`
- **Legacy Supabase Docs**: `/workspace/docs/legacy/` (archived)
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
