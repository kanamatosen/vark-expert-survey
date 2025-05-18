
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SurveyProvider } from "./contexts/SurveyContext";

import WelcomePage from "./pages/WelcomePage";
import VisualQuestionsPage from "./pages/VisualQuestionsPage";
import AuditoryQuestionsPage from "./pages/AuditoryQuestionsPage";
import KinestheticQuestionsPage from "./pages/KinestheticQuestionsPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHistoryPage from "./pages/AdminHistoryPage";
import NotFound from "./pages/NotFound";
import ResultDetailPage from './pages/ResultDetailPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SurveyProvider>
          <Toaster />
          <Sonner />
          
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/survey/visual" element={<VisualQuestionsPage />} />
              <Route path="/survey/auditory" element={<AuditoryQuestionsPage />} />
              <Route path="/survey/kinesthetic" element={<KinestheticQuestionsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/history" element={<AdminHistoryPage />} />
              <Route path="/admin/result/:resultId" element={<ResultDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SurveyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
