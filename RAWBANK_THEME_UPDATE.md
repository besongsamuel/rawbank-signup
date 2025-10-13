# Rawbank Theme & UX Update

## 🎨 Overview

The application has been completely redesigned with **Rawbank's brand colors** (Black & Yellow) combined with **Apple's minimalist design philosophy** for a clean, modern, and premium user experience.

Reference: [Rawbank Official Website](https://rawbank.com/)

---

## 🌟 Design Philosophy

### Rawbank Brand Values
As stated on their website:
> "Au-delà d'une banque, la puissance du changement"
> 
> - **Yellow (#FFCC00)**: Represents optimism and ambition
> - **Black (#000000)**: Symbolizes trust and confidence

### Apple-Inspired Simplicity
- Clean white backgrounds
- Minimal shadows and gradients
- Focus on content and readability
- Smooth, subtle animations
- San Francisco-style typography

---

## 🎨 Theme Changes

### **File Updated**: `src/theme/rawbankTheme.ts`

### Color Palette

```typescript
primary: {
  main: "#000000",        // Rawbank Black - Trust
  light: "#333333",
  dark: "#000000",
  contrastText: "#FFCC00" // Rawbank Yellow
}

secondary: {
  main: "#FFCC00",        // Rawbank Yellow - Optimism
  light: "#FFD633",
  dark: "#E6B800",
  contrastText: "#000000"
}

background: {
  default: "#FFFFFF",     // Clean Apple-like white
  paper: "#FFFFFF"
}

text: {
  primary: "#000000",     // Pure black for readability
  secondary: "#666666"    // Gray for secondary text
}
```

### iOS-Style System Colors

```typescript
success: "#34C759"  // iOS green
error: "#FF3B30"    // iOS red
warning: "#FFCC00"  // Yellow
info: "#007AFF"     // iOS blue
```

---

## 📝 Typography

### Apple-Inspired Font Stack

```typescript
fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
```

### Font Sizes & Weights
- **H1**: 3.5rem (56px), weight 700
- **H2**: 2.5rem (40px), weight 600
- **H3**: 2rem (32px), weight 600
- **Body1**: 1.0625rem (17px) - Apple's preferred size
- **Body2**: 0.9375rem (15px)
- **Caption**: 0.8125rem (13px)

### Key Typography Features
- **Negative letter-spacing** (-0.01em to -0.02em) for modern look
- **Sentence case buttons** (not uppercase) like Apple
- **Optimal line heights** (1.47 for body text)
- **Readable text colors** (pure black #000000)

---

## 🎯 Component Styling

### Buttons

**Primary (Contained)**
- Background: Black (#000000)
- Text: Yellow (#FFCC00)
- Hover: Slightly lighter black (#1a1a1a)
- Scale animation on interaction (0.98 on hover, 0.96 on active)

**Secondary**
- Background: Yellow (#FFCC00)
- Text: Black (#000000)
- Hover: Lighter yellow (#FFD633)

**Outlined**
- Border: Light gray (#E5E5E5)
- Hover: Black border with subtle background

**Style Features**
- Border radius: 12px
- Padding: 14px 28px
- No shadow (Apple style)
- Smooth scale transitions
- Sentence case text

### Text Fields & Selects

**Default State**
- Background: Very light gray (#FAFAFA)
- Border: Light gray (#E5E5E5, 1px)
- Border radius: 10px

**Hover State**
- Background: Lighter gray (#F5F5F5)
- Border: Black (#000000)

**Focused State**
- Background: White (#FFFFFF)
- Border: Black (#000000, 2px)
- Label: Black

**Features**
- Smooth transitions (0.2s ease)
- Subtle background colors
- Clean, minimal borders
- No heavy shadows

### Cards

```typescript
borderRadius: 20px
boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" // Subtle shadow
border: "1px solid #F5F5F5"
hover: "0 8px 30px rgba(0, 0, 0, 0.12)"
```

- Very subtle shadows (Apple style)
- Smooth hover transitions
- Clean white background
- Minimal borders

### Dividers

- Border color: #F0F0F0 (very subtle)

---

## 🎨 Layout Changes

### Background Update

**Old**: Purple gradient backgrounds
```typescript
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

**New**: Clean white Apple-style
```typescript
background: "#FFFFFF" // Clean Apple-like white background
```

### Files Updated
✅ `src/components/profile/PersonalInfoForm.tsx`
✅ `src/components/profile/CompleteProfile.tsx`
✅ `src/components/auth/SigninForm.tsx`
✅ `src/components/auth/Signup.tsx`
✅ `src/components/app/UserDashboard.tsx`
✅ `src/components/signup/IdCardUpload.tsx`
✅ `src/components/signup/SignupSkeleton.tsx`

---

## 🎨 Icon Colors

### Section Illustrations
All large section icons (64px) now use **Rawbank Yellow (#FFCC00)**:

```typescript
<Person sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
<Home sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
<Phone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
<Work sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
<ContactPhone sx={{ fontSize: 64, color: "#FFCC00", mb: 1 }} />
```

This creates a consistent brand identity throughout the application.

---

## 📱 Mobile Responsiveness

### Enhanced for All Devices

**Card Responsive Styling**
```typescript
[theme.breakpoints.down("sm")]: {
  margin: theme.spacing(1),
  borderRadius: theme.spacing(1),
}
```

**Content Padding**
```typescript
sx={{ p: { xs: 2, sm: 3, md: 4 } }}
```

**Field Widths**
```typescript
sx={{ 
  flex: 1, 
  minWidth: { xs: "100%", sm: 250 } 
}}
```

### Breakpoints
- **xs (0-600px)**: Mobile - Full width, reduced padding
- **sm (600-960px)**: Tablet - Flexible columns, medium padding
- **md (960px+)**: Desktop - Multi-column, full padding

---

## 🌍 Country/Province/City Dropdowns

### Smart Location Selection with DRC Default

**Package**: `country-state-city`

#### Features Implemented:

1. **Nationality Dropdown**
   - All countries available
   - **Default**: Congo (the Democratic Republic of the) [CD]
   - Icon: Globe (Public)
   - Helper text: "Votre pays de citoyenneté"

2. **Province Dropdown**
   - DRC provinces dynamically loaded
   - Updates when country changes
   - Icon: Location pin (LocationOn)
   - Helper text: "Province où vous êtes originaire"

3. **City Dropdown (Birth Place)**
   - Cities loaded based on selected province
   - Disabled until province is selected
   - Icon: Location pin (LocationOn)
   - Contextual helper: "Sélectionnez d'abord une province" or "Sélectionnez votre ville"

#### DRC Provinces Available:
- Kinshasa
- Kongo Central
- Kwango, Kwilu, Mai-Ndombe
- Kasaï, Kasaï-Central, Kasaï-Oriental
- Lomami, Sankuru
- Maniema
- South Kivu, North Kivu
- Ituri, Haut-Uele, Tshopo, Bas-Uele
- Nord-Ubangi, Mongala, Tshuapa, Équateur, Sud-Ubangi
- Lualaba, Haut-Katanga, Haut-Lomami, Tanganyika

---

## ✉️ Email 1 Pre-filled & Disabled

### User Experience Enhancement

**Implementation**:
```typescript
<TextField
  label="Email 1 *"
  type="email"
  value={user?.email || contactInfo.email1 || ""}
  disabled
  helperText="Email utilisé pour la connexion (non modifiable)"
  sx={{ 
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
    },
  }}
/>
```

**Features**:
- ✅ Automatically populated from logged-in user
- 🔒 Disabled (non-editable)
- 👁️ Readable text (not grayed out completely)
- 💬 Clear helper text explaining it's from login

**Auto-initialization**:
```typescript
useEffect(() => {
  if (user?.email && !contactInfo.email1) {
    onDataChange({
      contactInfo: { email1: user.email },
    });
  }
}, [user, contactInfo.email1]);
```

---

## 🎯 Design Principles Applied

### 1. **Simplicity** (Apple-inspired)
- ❌ No gradients
- ❌ No heavy shadows
- ❌ No complex animations
- ✅ Clean white backgrounds
- ✅ Subtle shadows
- ✅ Simple scale transitions
- ✅ Focus on content

### 2. **Brand Identity** (Rawbank)
- ✅ Black & Yellow color scheme
- ✅ Yellow icons for sections
- ✅ Black primary buttons with yellow text
- ✅ Professional and trustworthy

### 3. **Readability**
- ✅ Pure black text (#000000)
- ✅ Large font sizes (17px body)
- ✅ Optimal line heights (1.47)
- ✅ Negative letter-spacing
- ✅ High contrast

### 4. **User Experience**
- ✅ Clear helper texts
- ✅ Icons on all inputs
- ✅ Section illustrations
- ✅ Responsive design
- ✅ Touch-friendly (mobile)
- ✅ Smooth interactions

### 5. **Accessibility**
- ✅ High contrast ratios
- ✅ Clear focus states
- ✅ Readable disabled states
- ✅ Descriptive labels
- ✅ Helpful error messages

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Background** | Purple gradient | Clean white |
| **Primary Color** | Blue (#1e3c72) | Black (#000000) |
| **Accent Color** | Purple (#667eea) | Yellow (#FFCC00) |
| **Typography** | Segoe UI | San Francisco (-apple-system) |
| **Button Text** | UPPERCASE | Sentence case |
| **Shadows** | Heavy (20-40px blur) | Subtle (4-20px blur) |
| **Border Radius** | 8-20px | 10-20px |
| **Input Background** | White | Light gray (#FAFAFA) |
| **Section Icons** | Blue | Yellow |
| **Overall Feel** | Corporate, formal | Premium, modern |

---

## 🚀 Build Status

✅ **Build Successful**
- No errors
- Only minor ESLint warnings (unused variables)
- Bundle size: ~2.51 MB (due to country-state-city package)

### Build Output
```bash
Compiled with warnings.
File sizes after gzip:
  2.51 MB  build/static/js/main.3b59a5fd.js
  263 B    build/static/css/main.e6c13ad2.css
```

---

## 📱 Mobile-Friendly Features

✅ **Touch-friendly** - Proper touch targets (14px padding)
✅ **No horizontal scroll** - Content fits viewport
✅ **Readable text** - 17px body size
✅ **Responsive cards** - Adapts to screen size
✅ **Stack on mobile** - Single column layout
✅ **Comfortable spacing** - 8px base unit
✅ **Clear disabled states** - Email 1 clearly non-editable
✅ **Helper text visible** - Guidance on all devices
✅ **Icons scale properly** - 64px section icons

---

## 🎨 Color Reference Guide

### Primary Colors
```
Black (Primary):     #000000
Yellow (Secondary):  #FFCC00
White (Background):  #FFFFFF
```

### Grays
```
Dark Gray:   #333333
Medium Gray: #666666
Light Gray:  #E5E5E5
Ultra Light: #FAFAFA
Border:      #F0F0F0
Card Border: #F5F5F5
```

### System Colors
```
Success: #34C759 (iOS Green)
Error:   #FF3B30 (iOS Red)
Info:    #007AFF (iOS Blue)
Warning: #FFCC00 (Yellow)
```

---

## 🎯 User Experience Highlights

### For Non-Tech-Savvy Users

1. **Clear Visual Hierarchy**
   - Large yellow icons catch attention
   - Numbered sections (1. Identité, 2. Situation...)
   - Descriptive section subtitles

2. **Helpful Guidance**
   - Icons on every input field
   - Helper text below each field
   - Example placeholders
   - Clear error messages

3. **Smart Defaults**
   - Email pre-filled from account
   - DRC selected by default
   - Fields disabled when appropriate

4. **Progressive Disclosure**
   - City dropdown only enabled after province
   - Marital regime only for married users
   - Clear conditional logic

5. **Mobile Optimized**
   - Single column on small screens
   - Large touch targets
   - Readable font sizes
   - Minimal scrolling needed

---

## 🔄 Next Steps (Pending TODOs)

### ⏳ FATCA Step Component
- Create form for FATCA declaration
- Add US person checkboxes
- Tax identification number field
- Signature capture

### ⏳ PEP Step Component
- Create form for PEP declaration
- Category selection
- Position/organization fields
- Relationship disclosure

---

## 📚 References

- **Rawbank Website**: https://rawbank.com/
- **Apple Design Guidelines**: Implicit inspiration from iOS/macOS
- **Material-UI Documentation**: https://mui.com/
- **Country State City Package**: https://www.npmjs.com/package/country-state-city

---

## 🎉 Summary

The application now features:

✅ **Rawbank's Black & Yellow brand colors**
✅ **Apple-inspired clean, minimal design**
✅ **Premium, trustworthy appearance**
✅ **Fully responsive and mobile-friendly**
✅ **Smart country/province/city selection**
✅ **Pre-filled email from user account**
✅ **Enhanced UX for non-tech-savvy users**
✅ **Consistent visual language throughout**
✅ **Subtle animations and interactions**
✅ **High contrast and accessibility**

The design strikes the perfect balance between **Rawbank's bold brand identity** and **Apple's renowned simplicity**, creating a **premium banking experience** that is both **trustworthy** and **easy to use**.

---

**Updated**: October 13, 2025
**Version**: 2.0 - Rawbank Theme with Apple Simplicity

