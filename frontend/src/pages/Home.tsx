import { Link } from 'react-router-dom';
import { User, Car, Heart } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    document.title = "CampusRide";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 mb-6 drop-shadow-sm">
        Campus Ride Match
      </h1>
      <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl px-4">
        No map needed. Simply choose your campus stop, broadcast your destination, and match instantly with drivers heading your way.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center px-4">
        <Link 
          to="/passenger" 
          className="group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <User size={36} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Passenger</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Need a ride somewhere?</p>
        </Link>
        
        <Link 
          to="/driver" 
          className="group relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full"
        >
          <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <Car size={36} className="text-sky-600 dark:text-sky-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Driver</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Have empty seats to share?</p>
        </Link>
      </div>

      <div className="mt-24 w-full max-w-4xl text-left bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
          How It Works
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
              <User size={20} /> For Passengers
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
              <li>Tap <strong>Passenger Mode</strong> from the home menu.</li>
              <li>Authenticate with your name and valid college email.</li>
              <li>Select your pickup stop and destination drop-off.</li>
              <li>Broadcast your request to all nearby active drivers.</li>
              <li>Wait for a rickshaw driver to accept and verify their auto number!</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-sky-600 dark:text-sky-400 mb-3 flex items-center gap-2">
              <Car size={20} /> For Drivers
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
              <li>Tap <strong>Driver Mode</strong> to start sharing your rides.</li>
              <li>Log in with your name and vehicle auto number.</li>
              <li>Wait in the Driver Portal to listen for incoming live requests.</li>
              <li>Accept rides from students waiting to travel along your route.</li>
              <li>Safely complete the ride when the student drops off!</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-20 mb-8 border-t border-slate-200 dark:border-slate-800 pt-8 w-full max-w-lg flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-1.5 flex-wrap">
          &copy; 2026 CampusRide. Made by student for student with <Heart size={14} className="text-red-500 fill-red-500" /> and hardwork.
        </p>
        <a 
          href="https://github.com/milanprajapati571/rickshaw-matching-system" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default Home;
