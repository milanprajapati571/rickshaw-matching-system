import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import Passenger from './pages/Passenger';
import Driver from './pages/Driver';
import Admin from './pages/Admin';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-4 sticky top-0 z-10 transition-colors duration-200">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              🛺 CampusRide
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/passenger" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Passenger Mode</Link>
              <Link to="/driver" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Driver Mode</Link>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
        </nav>
        
        <main className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passenger" element={<Passenger />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
