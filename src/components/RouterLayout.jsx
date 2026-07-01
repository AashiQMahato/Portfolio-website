import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ActiveContextProvider } from "../contextState";
import { ThemeProvider } from "../context/ThemeContext";
import { RecruiterModeProvider } from "../context/RecruiterModeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";
import Iridescence from "./ui/Iridescence";
import CommandPalette from "./CommandPalette";
import Terminal from "./Terminal";

const RouterLayout = () => {
  const [enableIridescence, setEnableIridescence] = useState(false);

  useEffect(() => {
    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallMql = window.matchMedia("(max-width: 0px)");

    const update = () => {
      const saveData = navigator?.connection?.saveData;
      setEnableIridescence(
        !(reduceMql.matches || smallMql.matches || saveData),
      );
    };

    update();
    reduceMql.addEventListener("change", update);
    smallMql.addEventListener("change", update);
    return () => {
      reduceMql.removeEventListener("change", update);
      smallMql.removeEventListener("change", update);
    };
  }, []);

  return (
    <ThemeProvider>
      <RecruiterModeProvider>
        <ActiveContextProvider>
          <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300 bg-background text-foreground">
            {/* Iridescence Background - Fixed z-0 across entire site */}
            {enableIridescence && (
              <div className="fixed inset-0 z-0 opacity-25 pointer-events-none">
                <Iridescence
                  color={[0.9, 0.8, 0.3]}
                  speed={0.6}
                  amplitude={0.1}
                  quality={0.7}
                  mouseReact={false}
                />
              </div>
            )}

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="relative">
              <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* AI Chatbot FAB */}
            <AIChatbot />

            {/* Global: Command Palette (⌘K) */}
            <CommandPalette />

            {/* Global: Terminal Mode */}
            <Terminal />
          </div>
        </ActiveContextProvider>
      </RecruiterModeProvider>
    </ThemeProvider>
  );
};

export default RouterLayout;
