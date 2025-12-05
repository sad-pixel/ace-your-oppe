import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/trpc";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProblemSets from "./pages/ProblemSets";
import ProblemSetView from "./pages/ProblemSetView";
import NotFound from "./pages/NotFound";
import Playground from "./pages/Playground";
import BrowseProblems from "./pages/BrowseProblems";
import SingleProblemView from "./pages/SingleProblem";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/problemsets" element={<ProblemSets />} />
          <Route path="/problemset/:setId" element={<ProblemSetView />} />
          <Route path="/problems" element={<BrowseProblems />} />
          <Route path="/problems/:problemId" element={<SingleProblemView />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
