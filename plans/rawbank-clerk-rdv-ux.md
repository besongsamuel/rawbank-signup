# Rawbank Clerk/RDV UX — Locked POC Spec (Addendum)

## Overview

Second persona for the same Rawbank POC app: **Clerk/Staff** flow for in-agency appointment handling. Client 7-screen signup remains **priority**; clerk is demoable alongside via Cognito groups.

## 5-Screen Clerk Flow

1. **Aujourd'hui** — Day agenda (list of scheduled RDVs)
2. **Détail RDV** — AI prep checklist + client info card
3. **Rencontre en cours** — Live timer + meeting in progress state
4. **Clôture** — Auto duration + soft override + outcome selection
5. **Semaine** (optional) — Week view for planning

## Data Models

### Appointment
- Core appointment record
- `scheduledDate`, `scheduledTime`, `agencyId`
- `status`: `scheduled | checked_in | in_progress | completed | no_show | rescheduled | cancelled`
- `prepData`: AI-extracted summary for clerk prep
- `checkInCode`: QR/code for client check-in (future)

### MeetingSession
- Per-meeting instance tracking
- `appointmentId`, `clerkId`, `clientId`, `applicationId`
- **Duration**: `startedAt`, `endedAt`, `durationMs` (server-calculated: `ended_at − started_at`)
- `durationOverrideMs`: Optional manual adjustment
- `outcome`: `completed | no_show | rescheduled | cancelled`
- `notes`: Clerk observations

### Event Logging (Analytics)

Track all clerk interactions for median/P90 duration calibration:

```typescript
rdv.viewed              // Clerk opened detail screen
rdv.day_agenda_opened   // Clerk opened today's agenda
rdv.prep_opened         // Clerk viewed AI prep card
rdv.started             // Meeting started (start timer)
rdv.completed           // Meeting completed successfully
rdv.no_show             // Client didn't show up
rdv.rescheduled         // Meeting rescheduled
rdv.cancelled           // Meeting cancelled
```

Each event includes:
- `timestamp` (server)
- `clerkId`, `clientId`, `applicationId`
- `appointmentId`, `meetingSessionId`
- `durationMs` (for completed events)
- `metadata`: JSON for additional context

After ≥30 meetings logged: slot-length suggestions (median/P90) — **later, not POC**.

## Screen Details

### 1. Aujourd'hui (Day Agenda)

**Purpose**: Clerk sees today's scheduled appointments at a glance.

**Layout**:
- Header: "Rendez-vous du jour" + date
- List of appointments:
  - Time (e.g., "09:00")
  - Client name
  - Status chip (color-coded)
  - Check-in code (if applicable)
- Tap card → Detail screen

**Status Colors**:
- `scheduled`: Gray (#5C5C5C)
- `checked_in`: Yellow (#FFCC00)
- `in_progress`: Blue (#007AFF)
- `completed`: Green (#34C759)
- `no_show`: Red (#FF3B30)

**Next-up pulse** (POC): Highlight next uncompleted appointment with subtle pulse animation.

**Empty state**: "Aucun rendez-vous pour aujourd'hui"

### 2. Détail RDV (AI Prep)

**Purpose**: Clerk reviews AI-extracted data and missing fields before meeting.

**Layout**:
- Header: "Détails du rendez-vous" + time + code
- **Client Info Card**:
  - Avatar circle (yellow bg)
  - Name (large)
  - "Nouveau client" badge
- **AI-Extracted Data** (green checkmark):
  - Full name (prénom, postnom, nom)
  - Birth date
  - ID number
  - Confidence score badge (e.g., "Confiance: 92%")
- **Missing Fields Card** (yellow warning):
  - "À compléter pendant l'entretien"
  - Chips for missing fields (phone, address, etc.)
- **CTA**: "Démarrer l'entretien" (black + yellow, 52px)

**Event logged**: `rdv.prep_opened` when screen loads.

### 3. Rencontre en cours (Live Timer)

**Purpose**: Meeting is active; clerk sees live duration.

**Layout**:
- Same as Detail screen, but:
  - Live timer displayed: "Entretien en cours depuis X min"
  - Timer updates every minute
  - Green text color (#34C759)
- **CTA**: "Terminer l'entretien"

**Event logged**: `rdv.started` when CTA clicked on Detail screen.

**Auto-refresh**: Timer ticks up in UI (no server polling needed).

### 4. Clôture (Outcome + Duration)

**Purpose**: Clerk closes the meeting with outcome and auto-calculated duration.

**Layout**:
- Header: "Terminer l'entretien"
- **Duration Display**:
  - "Durée: X minutes" (auto-calculated)
  - SLA warning if > expected (e.g., "Durée supérieure à la cible (30 min)")
- **Outcome Radio Buttons** (sentence case):
  - "Compte ouvert avec succès" (green border when selected)
  - "Client absent" (red border)
  - "Reprogrammé" (yellow border)
- **Notes** (optional): Multiline text field
- **CTA**: "Enregistrer et terminer"

**Duration Calculation**:
- Server: `ended_at − started_at = durationMs`
- Display in minutes: `Math.floor(durationMs / 60000)`
- Soft override: If clerk adjusts manually (future), save as `durationOverrideMs`

**Event logged**: `rdv.completed | no_show | rescheduled` with `durationMs`.

**Navigation**: Back to Aujourd'hui (agenda) after save.

### 5. Semaine (Week View) — Optional

**Purpose**: Week-level planning view for clerks.

**Not in POC scope** — scaffold route but leave for later. Focus on day-level flow.

## Visual System (Matches Client)

**Colors**: Same as client (#000000, #FFCC00, #FFFFFF, #F5F5F5, #5C5C5C)

**CTA**: Black bg + yellow label, 52px height

**Typography**: System UI, ~17px body, sentence case, FR-first

**Motion**: Page enter fade+rise, CTA press scale(0.98), next-up pulse (subtle)

**Max Width**: 420px centered (same as client)

## Role-Based Access (Cognito Groups)

**Two groups**:
- `client`: Access to 7-screen signup flow (`/`, `/signup`, `/onboarding/*`, `/dashboard`)
- `clerk`: Access to clerk flow (`/clerk/*`)

**Implementation**:
- Cognito custom attributes: `custom:userType = client | clerk`
- Or Cognito groups: Users assigned to `client` or `clerk` group
- `ProtectedRoute` checks group membership
- Sign-in redirects based on group:
  - `client` → `/onboarding/id-upload`
  - `clerk` → `/clerk/calendar`

**POC simplification**: All users are `client` by default; manually assign `clerk` group in Cognito console for demo.

## Data Flow

### Meeting Start
1. Clerk opens Detail screen → log `rdv.prep_opened`
2. Clerk taps "Démarrer l'entretien"
3. Create `MeetingSession` record with `startedAt = now()`
4. Log `rdv.started` event
5. Navigate to "Rencontre en cours" (same screen, timer shown)

### Meeting End
1. Clerk taps "Terminer l'entretien"
2. Navigate to Clôture screen
3. Calculate `durationMs = now() − startedAt`
4. Clerk selects outcome + notes
5. Update `MeetingSession`: `endedAt = now()`, `durationMs`, `outcome`, `notes`
6. Update `Appointment`: `status = completed | no_show | rescheduled`
7. Log `rdv.completed | no_show | rescheduled` event with `durationMs`
8. Navigate back to Aujourd'hui

## POC Scope (What to Ship)

### ✅ Include
- 5 clerk screens (1-4 + scaffold 5)
- Appointment + MeetingSession models in Amplify Data
- Event logging for all `rdv.*` events
- Auto duration calculation (server timestamps)
- AI prep card on Detail screen
- Live timer on Rencontre en cours
- Outcome selection on Clôture
- Seed sample appointments (3-5 mock RDVs for demo)
- FR-first microcopy
- Next-up pulse on Aujourd'hui

### ❌ Defer (Post-POC)
- Full booking/scheduling UI
- Client check-in QR code generation
- Duration override UI (soft override field exists in schema)
- Week view implementation
- Slot-length suggestions (requires ≥30 meetings)
- Real-time notifications
- Multi-clerk assignment
- Agency management

## Seed Data (Mock RDVs)

For demo purposes, seed 3-5 appointments in various states:

```typescript
[
  {
    clientName: 'Jean Ngandu Mukendi',
    scheduledTime: '09:00',
    status: 'scheduled',
    checkInCode: 'ABC123',
    prepData: {
      extracted: { firstName: 'Jean', middleName: 'Ngandu', lastName: 'Mukendi', birthDate: '1990-05-20', idNumber: 'AB1234567' },
      missing: ['phone', 'address'],
      confidence: 0.92,
    },
  },
  {
    clientName: 'Marie Tshala Kabongo',
    scheduledTime: '10:30',
    status: 'checked_in',
    prepData: { extracted: {...}, missing: ['phone'], confidence: 0.88 },
  },
  {
    clientName: 'Joseph Ilunga Mwamba',
    scheduledTime: '14:00',
    status: 'scheduled',
    prepData: { extracted: {...}, missing: [], confidence: 0.95 },
  },
]
```

Hard-code in `ClerkCalendar.tsx` for POC. Real booking flow later.

## Analytics Questions (Future)

With logged events, answer:
- Median meeting duration?
- P90 meeting duration?
- % no-shows?
- Avg prep time (detail screen view duration)?
- Clerk efficiency metrics?

**Not in POC**: Just log events. Analytics dashboard later.

---

**Status**: Locked for POC implementation  
**Priority**: Client 7-screen flow first, clerk demoable alongside  
**Owner**: Product & UX  
**Refs**: Client UX spec `rawbank-signup-ux-refresh.md`
