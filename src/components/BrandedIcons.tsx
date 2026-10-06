import { Box, SvgIcon, SvgIconProps } from '@mui/material';

// Yellow claw accent (Rawbank-inspired)
export function ClawAccent(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 80 80">
      <defs>
        <linearGradient id="clawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCC00" />
          <stop offset="100%" stopColor="#FFD633" />
        </linearGradient>
      </defs>
      <path
        d="M 0 40 Q 20 20, 40 0 Q 60 20, 80 40 Q 60 60, 40 80 L 0 40 Z"
        fill="url(#clawGradient)"
      />
    </SvgIcon>
  );
}

// Success checkmark
export function SuccessMark(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#34C759" opacity="0.1" />
      <circle cx="32" cy="32" r="24" fill="#34C759" />
      <path
        d="M 20 32 L 28 40 L 44 24"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

// Empty state illustration
export function EmptyStateIllustration(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="#F5F5F5" />
      <rect x="40" y="45" width="40" height="30" rx="4" fill="#E5E5E5" />
      <rect x="50" y="55" width="20" height="2" rx="1" fill="#5C5C5C" />
      <rect x="50" y="60" width="15" height="2" rx="1" fill="#5C5C5C" />
      <rect x="50" y="65" width="25" height="2" rx="1" fill="#5C5C5C" />
    </SvgIcon>
  );
}

// AI sparkle icon
export function AISparkle(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <path
        d="M 32 8 L 36 28 L 56 32 L 36 36 L 32 56 L 28 36 L 8 32 L 28 28 Z"
        fill="#FFCC00"
      />
      <path
        d="M 48 12 L 50 20 L 58 22 L 50 24 L 48 32 L 46 24 L 38 22 L 46 20 Z"
        fill="#FFD633"
      />
    </SvgIcon>
  );
}

// Document/ID icon
export function DocumentIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <rect x="12" y="8" width="40" height="48" rx="4" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="2" />
      <rect x="20" y="20" width="24" height="3" rx="1.5" fill="#FFCC00" />
      <rect x="20" y="28" width="24" height="2" rx="1" fill="#5C5C5C" />
      <rect x="20" y="34" width="20" height="2" rx="1" fill="#5C5C5C" />
      <rect x="20" y="40" width="24" height="2" rx="1" fill="#5C5C5C" />
    </SvgIcon>
  );
}

// Rawbank wordmark placeholder (simple text-based)
export function RawbankLogo({ size = 120 }: { size?: number }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 700,
        fontSize: size / 5,
        letterSpacing: '-0.03em',
        color: '#0A0A0A',
      }}
    >
      <Box component="span" sx={{ color: '#FFCC00' }}>RAW</Box>
      <Box component="span">BANK</Box>
    </Box>
  );
}
