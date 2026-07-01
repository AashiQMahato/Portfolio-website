import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterLayout from "./components/RouterLayout";
import HomePage from "./components/HomePage";
import ContactUs from "./components/ContactUs";
import Projects from "./components/Projects";
import Education from "./components/Education";
import About from "./components/About";
import Skills from "./components/Skills";
import Testimonials from "./components/Testimonials";

// Lazy-loaded pages
const ProjectCaseStudy = lazy(() => import("./pages/ProjectCaseStudy"));
const GitHubDashboard = lazy(() => import("./pages/GitHubDashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NowPage = lazy(() => import("./pages/NowPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<RouterLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectCaseStudy />} />
            <Route path="contactus" element={<ContactUs />} />
            <Route path="education" element={<Education />} />
            <Route path="skills" element={<Skills />} />
            <Route path="testimonials" element={<Testimonials />} />
            
            {/* New Routes */}
            <Route path="developer-dashboard" element={<GitHubDashboard />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="now" element={<NowPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
