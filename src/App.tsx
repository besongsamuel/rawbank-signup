import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserDashboard from "./components/app/UserDashboard";
import SigninForm from "./components/auth/SigninForm";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CompleteProfile from "./components/profile/CompleteProfile";
import "./i18n"; // Initialize i18n

function App(): React.JSX.Element {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<SigninForm />} />

          {/* Profile completion routes - all require authentication (merged steps) */}
          <Route
            path="/profile/account-selection"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_account" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/id-identity"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_id_identity" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/marital-housing"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_marital_housing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/contact-emergency"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_contact_emergency" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/professional"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_professional" />
              </ProtectedRoute>
            }
          />

          {/* FATCA, PEP, and Card Selection steps */}
          <Route
            path="/profile/fatca"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_fatca" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/pep"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_pep" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/card-selection"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_card" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/review"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_review" />
              </ProtectedRoute>
            }
          />

          {/* Legacy routes - redirect to new merged structure */}
          <Route
            path="/profile/personal-info"
            element={<Navigate to="/profile/id-identity" replace />}
          />
          <Route
            path="/profile/id-card"
            element={<Navigate to="/profile/id-identity" replace />}
          />
          <Route
            path="/profile/identity"
            element={<Navigate to="/profile/id-identity" replace />}
          />
          <Route
            path="/profile/marital"
            element={<Navigate to="/profile/marital-housing" replace />}
          />
          <Route
            path="/profile/housing"
            element={<Navigate to="/profile/marital-housing" replace />}
          />
          <Route
            path="/profile/contact"
            element={<Navigate to="/profile/contact-emergency" replace />}
          />
          <Route
            path="/profile/emergency"
            element={<Navigate to="/profile/contact-emergency" replace />}
          />
          <Route
            path="/complete-profile"
            element={<Navigate to="/profile/id-identity" replace />}
          />

          {/* App dashboard - requires complete profile */}
          <Route
            path="/app"
            element={
              <ProtectedRoute requireCompleteProfile={true}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
