import { Box } from '@mui/material';
import { ClipboardEvent, KeyboardEvent, useRef } from 'react';

interface CodeDigitsProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeDigits = ({ value, onChange }: CodeDigitsProps) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (index: number) => {
    const next = Math.max(0, Math.min(5, index));
    inputs.current[next]?.focus();
  };

  const writeAt = (index: number, text: string) => {
    const digits = text.replace(/\D/g, '');
    if (!digits) return;
    const buffer = value.split('');
    digits.split('').forEach((digit, offset) => {
      if (index + offset < 6) buffer[index + offset] = digit;
    });
    const next = buffer.join('').replace(/\D/g, '').slice(0, 6);
    onChange(next);
    focusAt(Math.min(index + digits.length, 5));
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
        focusAt(index);
        return;
      }
      onChange(value.slice(0, Math.max(0, index - 1)) + value.slice(index));
      focusAt(index - 1);
    }
    if (event.key === 'ArrowLeft') focusAt(index - 1);
    if (event.key === 'ArrowRight') focusAt(index + 1);
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    writeAt(index, event.clipboardData.getData('text'));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {Array.from({ length: 6 }, (_, index) => (
        <Box
          key={index}
          component="input"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Chiffre ${index + 1} du code`}
          value={value[index] ?? ''}
          ref={(node: HTMLInputElement | null) => {
            inputs.current[index] = node;
          }}
          onChange={(event) => writeAt(index, event.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          sx={{
            width: 48,
            height: 56,
            p: 0,
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            color: '#0A0A0A',
            borderRadius: '12px',
            border: '1.5px solid #E5E5E5',
            bgcolor: '#FAFAFA',
            outline: 'none',
            '&:focus': {
              border: '2px solid #FFCC00',
              bgcolor: '#FFFFFF',
            },
          }}
        />
      ))}
    </Box>
  );
};

export default CodeDigits;
