import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RouterLayout from "./components/RouterLayout";
import Home from "./pages/Home";

// Lazy-loaded pages — RouterLayout owns the Suspense boundary so the nav
// and footer stay mounted while a route chunk loads.
const Projects = lazy(() => import("./pages/Projects"));
const ProjectCaseStudy = lazy(() => import("./pages/ProjectCaseStudy"));
const GitHubDashboard = lazy(() => import("./pages/GitHubDashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NowPage = lazy(() => import("./pages/NowPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const toHome = (hash) => <Navigate to={{ pathname: "/", hash }} replace />;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RouterLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectCaseStudy />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="now" element={<NowPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="developer-dashboard" element={<GitHubDashboard />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />

        {/* Section shortcuts and legacy routes → home anchors (no dead links) */}
        <Route path="about" element={toHome("#about")} />
        <Route path="experience" element={toHome("#experience")} />
        <Route path="skills" element={toHome("#skills")} />
        <Route path="education" element={toHome("#experience")} />
        <Route path="testimonials" element={toHome("#work")} />
        <Route path="contactus" element={toHome("#contact")} />
        <Route path="contact" element={toHome("#contact")} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
