import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RouterLayout from "./components/RouterLayout";
import Home from "./pages/Home";

// Lazy-loaded pages
const Projects = lazy(() => import("./components/Projects"));
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
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectCaseStudy />} />

            {/* Old section routes → home anchors (no dead links) */}
            <Route path="about" element={<Navigate to={{ pathname: "/", hash: "#about" }} replace />} />
            <Route path="skills" element={<Navigate to={{ pathname: "/", hash: "#skills" }} replace />} />
            <Route path="education" element={<Navigate to={{ pathname: "/", hash: "#about" }} replace />} />
            <Route path="testimonials" element={<Navigate to={{ pathname: "/", hash: "#testimonials" }} replace />} />
            <Route path="contactus" element={<Navigate to={{ pathname: "/", hash: "#contact" }} replace />} />
            
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
