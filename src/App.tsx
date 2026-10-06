import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
import RemainingInfo from './pages/RemainingInfo';
import OTPVerify from './pages/OTPVerify';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={rawbankTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Authenticator.Provider>
          <Layout>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
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
                path="/onboarding/remaining"
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
                path="/dashboard"
                element={
                  <ProtectedRoute requireComplete>
                    <Dashboard />
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
