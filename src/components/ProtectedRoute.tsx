import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requireComplete?: boolean;
}

export default function ProtectedRoute({ children, requireComplete = false }: ProtectedRouteProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/signin');
    }
  }, [authStatus, navigate]);

  if (authStatus === 'configuring' || authStatus === 'unauthenticated') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}
      >
        <CircularProgress sx={{ color: '#FFCC00' }} />
      </Box>
    );
  }

  return <>{children}</>;
}
