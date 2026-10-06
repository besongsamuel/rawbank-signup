# Rawbank Signup UX Refresh — Locked POC Spec

## 7-Screen Happy Path

1. **Welcome** — Brand + value prop + CTA
2. **Auth** — Compact Cognito sign-up/sign-in (required before S3 upload)
3. **ID Upload** — Type picker + camera/upload
4. **Extracting** — Full-screen AI extraction state with breath pulse
5. **Confirm** — Editable extracted data review
6. **Remaining** — Short form for AI gaps (~4-6 fields max)
7. **OTP/Verify** — Phone verification
8. **Success** — Account opened confirmation

## Visual System

### Colors
- **Primary**: `#000000` (black)
- **Accent**: `#FFCC00` (yellow)
- **Background**: `#FFFFFF` (light canvas)
- **Secondary text**: `#5C5C5C`
- **Surface**: `#F5F5F5`

### CTA Pattern (Primary)
- **Black background** (`#000000`)
- **Yellow label** (`#FFCC00`)
- **52px height** (mobile thumb-friendly)
- **Sticky bottom** on flow screens
- **Press state**: `scale(0.98)`

### Typography
- System UI stack
- ~17px body (1.0625rem)
- Sentence case everywhere
- Generous line-height (1.6)
- FR-first ("vous" form)

### Layout
- Max content width: 420px centered
- Soft shadows only (0 2px 12px rgba(10,10,10,0.06))
- Border radius: 12-16px
- Lots of whitespace

### Progress Indicator
- Thin yellow bar
- "Étape n sur 7" label
- Top of screen on flow pages

## Motion (Simple + Alive)

All animations honor `prefers-reduced-motion`:

### Page Transitions
- **Enter**: fade + 8px upward rise (200ms ease-out)
- **Exit**: fade out (150ms)

### CTA Interaction
- **Press**: `scale(0.98)` (100ms cubic-bezier)
- **Release**: spring back

### Extracting State
- **Breath pulse**: subtle scale 1.0 → 1.02 → 1.0 (2s ease-in-out infinite)
- **Progress bar**: smooth determinate animation

### Confirm Screen
- **Field fill highlight**: brief yellow (#FFCC00) border flash on pre-filled field (300ms)
- **Extract success**: yellow claw flash overlay (400ms fade-out)

### Welcome Logo
- **Subtle breath**: 4-6s slow scale (barely perceptible)

## Screen Details

### 1. Welcome
- Yellow claw accent (CSS, no logo assets)
- "RAWBANK" wordmark (black)
- "Ouvrez votre compte en quelques minutes"
- Primary CTA: "Continuer" → Auth sheet
- Link: "J'ai déjà un compte"

### 2. Auth (Compact)
- Cognito email + password
- Minimal chrome
- Required before ID upload (S3 needs session)
- Can be modal/sheet over Welcome or dedicated screen

### 3. ID Upload
- "Étape 1 sur 7"
- Type picker: 4 chips (Passeport, Carte d'identité, Carte d'électeur, Permis)
- Camera/upload zone (dashed border)
- Sticky CTA: "Continuer"
- Link: "Saisir manuellement"

### 4. Extracting (Full Screen)
- No progress indicator (immersive)
- Large AI icon with breath pulse
- "Extraction en cours..."
- Determinate progress bar (0→100%)
- 2-4s simulated extraction

### 5. Confirm Editable
- "Étape 2 sur 7"
- "Vérifiez ces informations"
- Extracted fields (pre-filled, editable)
- Yellow border flash on mount
- Yellow claw flash overlay on enter (success feedback)
- Sticky CTA: "Confirmer"

### 6. Remaining
- "Étape 3 sur 7"
- "Complétez ces informations"
- 4-6 fields max (only what AI missed)
- Phone, Address, City typical gaps
- Sticky CTA: "Continuer"

### 7. OTP/Verify
- "Étape 4 sur 7"
- Phone verification
- 6-digit code input
- Resend link
- Sticky CTA: "Vérifier"

### 8. Success
- No progress bar
- Green checkmark
- "Demande envoyée!"
- Next steps bullets
- CTA: "Accéder au tableau de bord"

## What We Cut (Not in Happy Path)

- ❌ FATCA declaration
- ❌ PEP declaration  
- ❌ Marital status
- ❌ Professional info (employer, income)
- ❌ Card type selection
- ❌ Agency selection
- ❌ 9-10 step stepper
- ❌ AI extraction as modal over form

These can live in admin/compliance flows later, but not in the POC onboarding.

## Amplify Implementation Notes

- **Auth first**: Cognito session required before S3 upload
- **Storage**: ID images in S3 via Amplify Storage (identity access)
- **Function**: Lambda extract-id-data via OpenAI gpt-4o
- **Data**: DynamoDB via Amplify Data (user profile, extracted data)
- **Manual fallback**: If AI extraction fails, skip to Remaining with all fields empty

## Accessibility

- 48px+ tap targets (we use 52px CTA)
- Clear focus states (yellow outline)
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader tested

## Technical

- Vite + React + TypeScript
- Material-UI (custom theme)
- Amplify Gen 2 backend
- i18n (FR default, EN toggle)
- Mobile-first responsive
- PWA-ready

---

**Status**: Locked for POC implementation  
**Owner**: Product & UX  
**Implementation**: Amplify Gen 2 rewrite PR
