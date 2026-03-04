import { Outlet } from "react-router-dom";
import { ActiveContextProvider } from "../contextState";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIChatbot from "./AIChatbot";
import Iridescence from "./ui/Iridescence";

const RouterLayout = () => {
  return (
    <ThemeProvider>
      <ActiveContextProvider>
        <div className="relative min-h-screen bg-dark-950 transition-colors duration-300">
          {/* Iridescence Background - Fixed z-0 across entire site */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
            <Iridescence
              color={[0.5, 0.2, 0.8]}
              speed={0.5}
              amplitude={0.1}
              mouseReact={false}
            />
          </div>

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="relative z-10">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />

          {/* AI Chatbot FAB */}
          <AIChatbot />
        </div>
      </ActiveContextProvider>
    </ThemeProvider>
  );
};

export default RouterLayout;
