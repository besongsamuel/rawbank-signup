import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserDashboard from "./components/app/UserDashboard";
import SigninForm from "./components/auth/SigninForm";
import Signup from "./components/auth/Signup";
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
          <Route path="/signup" element={<Signup />} />

          {/* Profile completion routes - all require authentication */}
          <Route
            path="/profile/id-card"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_id" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/personal-info"
            element={
              <ProtectedRoute>
                <CompleteProfile step="step2_personal" />
              </ProtectedRoute>
            }
          />
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

          {/* Legacy complete-profile route - redirects to first step */}
          <Route
            path="/complete-profile"
            element={<Navigate to="/profile/id-card" replace />}
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
          <Route path="/" element={<Navigate to="/signup" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
