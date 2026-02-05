import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { PrivyContextProvider } from "./contexts/PrivyContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import StakingPage from "./pages/StakingPage";
import AdminPage from "./pages/AdminPage";
import StatsPage from "./pages/StatsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game" component={GamePage} />
      <Route path="/staking" component={StakingPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/stats" component={StatsPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <PrivyContextProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </PrivyContextProvider>
    </ErrorBoundary>
  );
}

export default App;
