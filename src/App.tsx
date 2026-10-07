import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Fade, useMediaQuery } from '@mui/material';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { rawbankTheme } from './theme';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import IdUpload from './pages/IdUpload';
import Extracting from './pages/Extracting';
import ConfirmData from './pages/ConfirmData';
import FamilyHousing from './pages/FamilyHousing';
import RemainingInfo from './pages/RemainingInfo';
import OTPVerify from './pages/OTPVerify';
import Profession from './pages/Profession';
import Fatca from './pages/Fatca';
import Pep from './pages/Pep';
import CardChoice from './pages/CardChoice';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import AccountAgency from './pages/AccountAgency';
import ClerkCalendar from './pages/clerk/ClerkCalendar';
import ClerkMeetingDetail from './pages/clerk/ClerkMeetingDetail';
import CompleteMeeting from './pages/clerk/CompleteMeeting';
import ProtectedRoute from './components/ProtectedRoute';

function AuthTransition() {
  const location = useLocation();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === displayPath) return;
    if (reduceMotion) {
      setDisplayPath(location.pathname);
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [location.pathname, displayPath, reduceMotion]);

  const handleExited = () => {
    setDisplayPath(pathRef.current);
    setVisible(true);
  };

  return (
    <Fade in={visible} appear timeout={reduceMotion ? 0 : 280} onExited={handleExited}>
      <Box
        sx={{
          '@media (prefers-reduced-motion: no-preference)': {
            transition: 'transform 280ms ease',
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
          },
        }}
      >
        {displayPath === '/signup' ? <SignUp /> : <SignIn />}
      </Box>
    </Fade>
  );
}

function App() {
  return (
    <ThemeProvider theme={rawbankTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Authenticator.Provider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Welcome />} />
              <Route element={<AuthTransition />}>
                <Route path="/signin" element={null} />
                <Route path="/signup" element={null} />
              </Route>
              
              {/* Client onboarding routes */}
              <Route
                path="/onboarding/account"
                element={
                  <ProtectedRoute>
                    <AccountAgency />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/id-upload"
                element={
                  <ProtectedRoute>
                    <IdUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/extracting"
                element={
                  <ProtectedRoute>
                    <Extracting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/confirm"
                element={
                  <ProtectedRoute>
                    <ConfirmData />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/family"
                element={
                  <ProtectedRoute>
                    <FamilyHousing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/contacts"
                element={
                  <ProtectedRoute>
                    <RemainingInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/verify"
                element={
                  <ProtectedRoute>
                    <OTPVerify />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/profession"
                element={
                  <ProtectedRoute>
                    <Profession />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/fatca"
                element={
                  <ProtectedRoute>
                    <Fatca />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/pep"
                element={
                  <ProtectedRoute>
                    <Pep />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/card"
                element={
                  <ProtectedRoute>
                    <CardChoice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireComplete>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

              {/* Clerk routes */}
              <Route
                path="/clerk/calendar"
                element={
                  <ProtectedRoute>
                    <ClerkCalendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clerk/meeting/:appointmentId"
                element={
                  <ProtectedRoute>
                    <ClerkMeetingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clerk/meeting/:appointmentId/complete"
                element={
                  <ProtectedRoute>
                    <CompleteMeeting />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Authenticator.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
