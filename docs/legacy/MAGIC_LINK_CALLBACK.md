# Magic Link Callback Implementation

## Overview

A dedicated route `/auth/callback` has been created to handle magic link authentication redirects. This provides better separation of concerns and cleaner error handling.

## Flow

### 1. User Requests Magic Link

- User enters email in SigninForm
- Magic link is sent with redirect URL: `${window.location.origin}/auth/callback`

### 2. User Clicks Magic Link

- Supabase redirects to `/auth/callback` with authentication parameters
- MagicLinkCallback component processes the authentication

### 3. Authentication Processing

The MagicLinkCallback component:

**If there's an error:**

- Logs the error to console
- Redirects to `/login?error=<error_message>`
- SigninForm displays the error in an Alert component

**If user is authenticated:**

- Checks if user has personal data
- If no personal data: redirects to `/profile/account-selection`
- If has personal data but no submitted application: redirects to `/profile/account-selection`
- If has submitted application: redirects to `/app`

**If user is not authenticated:**

- Redirects to `/login`

## Files Modified

### New Files

- `src/components/auth/MagicLinkCallback.tsx` - Handles magic link callback processing

### Modified Files

- `src/App.tsx` - Added `/auth/callback` route
- `src/components/auth/SigninForm.tsx` - Updated redirect URL and error handling
- `supabase/config.toml` - Added callback URLs to allowed redirects

## Benefits

1. **Separation of Concerns**: Authentication logic is separated from login form
2. **Better Error Handling**: Errors are properly captured and displayed
3. **Cleaner URLs**: Users don't see authentication parameters in the URL
4. **Consistent Flow**: All authentication redirects go through the same handler
5. **Better UX**: Loading state while processing authentication

## Configuration

Make sure to update your Supabase project settings to include the callback URL:

- `http://127.0.0.1:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

## Testing

To test the magic link flow:

1. Enter email in login form
2. Check email for magic link
3. Click magic link
4. Verify redirect to appropriate page based on user state
5. Test error scenarios by modifying the callback URL parameters
