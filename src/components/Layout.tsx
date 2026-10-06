import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  // Hide header on welcome page
  if (isWelcomePage) {
    return <Box>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: '#0A0A0A',
          borderBottom: '3px solid #FFCC00',
        }}
      >
        <Container maxWidth="md">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                color: '#FFCC00',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              RAWBANK
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={toggleLanguage}
              sx={{ color: '#FFCC00' }}
              size="large"
            >
              <LanguageIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
