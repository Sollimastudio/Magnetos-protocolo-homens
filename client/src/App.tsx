import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

/**
 * DESIGN PHILOSOPHY: Luxo Sensorial com Drama
 * Magnetus III - O Manual da Atração Soberana
 * 
 * Paleta: Preto Profundo (#050505) + Ouro Gradiente (#D4AF37) + Burgundy (#4A0404)
 * Tipografia: Playfair Display (elegância) + Inter (modernidade)
 * Atmosfera: Sofisticada, provocadora, sensorial
 * Efeitos: Glass-morphism, gradientes, texturas, animações fluidas
 */

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
