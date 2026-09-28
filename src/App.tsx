import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Skills } from './pages/Skills';
import { Resume } from './pages/Resume';
import { JobRoles } from './pages/JobRoles';
import { Analyze } from './pages/Analyze';
import { Roadmap } from './pages/Roadmap';
import { Projects } from './pages/Projects';
import { Interview } from './pages/Interview';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/job-roles" element={<JobRoles />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              {/* Catch-all 404 handler */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
