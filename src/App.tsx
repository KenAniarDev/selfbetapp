
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SettingsPage from "./components/SettingsPage";
import GoalCreation from "./components/GoalCreation";
import HabitDashboard from "./components/HabitDashboard";
import ProofSubmission from "./components/ProofSubmission";
import NotFound from "./pages/NotFound";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import PaymentSetupWrapper from "./components/PaymentSetupWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - redirect authenticated users */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            
            {/* Protected routes - redirect unauthenticated users */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<GoalCreation />} />
              <Route path="dashboard" element={<HabitDashboard />} />
              <Route path="proof" element={<ProofSubmission />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="payment" element={<PaymentSetupWrapper />} />
            </Route>
            
            {/* Fallback route for root to prevent conflicts */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PWAInstallPrompt />
        <OfflineIndicator />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
