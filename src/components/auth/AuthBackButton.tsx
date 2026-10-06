import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AuthBackButtonProps {
  onClick: () => void;
}

const AuthBackButton = ({ onClick }: AuthBackButtonProps) => {
  return (
    <Button
      type="button"
      variant="text"
      onClick={onClick}
      startIcon={<ArrowBackIcon />}
      sx={{
        alignSelf: 'flex-start',
        minHeight: 40,
        px: 0,
        mb: 2,
        color: '#0A0A0A',
        fontWeight: 600,
      }}
    >
      Retour
    </Button>
  );
};

export default AuthBackButton;
