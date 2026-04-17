import { useState, useEffect } from 'react';
import { socket } from '../lib/socket';
import { MapPin, Navigation, Loader2, Car } from 'lucide-react';

interface Stop {
  id: string;
  name: string;
}

const Passenger = () => {
  useEffect(() => {
    document.title = "CampusRide - Passenger";
  }, []);

  const [stops, setStops] = useState<Stop[]>([]);
  const [passengerName, setPassengerName] = useState(() => sessionStorage.getItem('passengerName') || '');
  const [passengerEmail, setPassengerEmail] = useState(() => sessionStorage.getItem('passengerEmail') || '');
  const [origin, setOrigin] = useState(() => sessionStorage.getItem('rideOrigin') || '');
  const [destination, setDestination] = useState(() => sessionStorage.getItem('rideDest') || '');
  const [status, setStatus] = useState<'auth' | 'idle' | 'searching' | 'matched' | 'completed'>(() => {
    const savedStatus = sessionStorage.getItem('rideStatus');
    if (savedStatus && savedStatus !== 'auth') return savedStatus as any;
    return sessionStorage.getItem('passengerName') && sessionStorage.getItem('passengerEmail') ? 'idle' : 'auth';
  });
  const [matchData, setMatchData] = useState<any>(() => JSON.parse(sessionStorage.getItem('matchData') || 'null'));

  useEffect(() => {
    sessionStorage.setItem('passengerName', passengerName);
    sessionStorage.setItem('passengerEmail', passengerEmail);
    sessionStorage.setItem('rideOrigin', origin);
    sessionStorage.setItem('rideDest', destination);
    sessionStorage.setItem('rideStatus', status);
    if (matchData) sessionStorage.setItem('matchData', JSON.stringify(matchData));
    else sessionStorage.removeItem('matchData');
  }, [origin, destination, status, matchData, passengerName, passengerEmail]);

  useEffect(() => {
    // Fetch stops from backend
    fetch((import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api/stops')
      .then(res => res.json())
      .then(data => setStops(data))
      .catch(err => console.error("Could not fetch stops", err));

    // Listen for driver acceptance
    socket.on('request_accepted', (data) => {
      if (data.passengerId === socket.id) {
        setStatus('matched');
        setMatchData(data);
      }
    });

    socket.on('ride_completed', (data) => {
      if (data.passengerId === socket.id) {
        setStatus('completed');
      }
    });

    return () => {
      socket.off('request_accepted');
      socket.off('ride_completed');
    };
  }, []);

  const handleBroadcast = () => {
    if (!passengerName || !origin || !destination) return;
    if (origin === destination) {
        alert("Origin and destination cannot be the same");
        return;
    }
    
    setStatus('searching');
    socket.emit('broadcast_request', {
      passengerId: socket.id,
      passengerName: passengerName,
      passengerEmail: passengerEmail,
      origin: stops.find(s => s.id === origin)?.name,
      destination: stops.find(s => s.id === destination)?.name,
      timestamp: new Date().toISOString()
    });
  };

  const handleReset = () => {
      setStatus('idle');
      setMatchData(null);
      setOrigin('');
      setDestination('');
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-blue-600 dark:bg-blue-900 border-b border-transparent dark:border-blue-800 p-6 text-white text-center">
          <h2 className="text-3xl font-bold mb-1">Passenger</h2>
          <p className="text-blue-100 dark:text-blue-200 text-sm">Find a ride across campus</p>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          {status === 'auth' && (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Name</label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={passengerName}
                    onChange={e => setPassengerName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">College Email</label>
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    placeholder="Enter your college email"
                    value={passengerEmail}
                    onChange={e => setPassengerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!passengerName.trim()) {
                    alert("Please enter your name");
                    return;
                  }
                  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(passengerEmail)) {
                    alert("Please enter a valid email address");
                    return;
                  }
                  setStatus('idle');
                }}
                disabled={!passengerName || !passengerEmail}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200/50 dark:shadow-none transform transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Proceed to Booking
              </button>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
               <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Logged in as</p>
                  <p className="font-bold text-blue-900 dark:text-blue-100">{passengerName}</p>
                </div>
                <button 
                  onClick={() => setStatus('auth')}
                  className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Pickup Stop</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 text-slate-400 dark:text-slate-300" size={18} />
                  <select 
                    value={origin} 
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-700 dark:text-white"
                  >
                    <option value="" disabled>Select pickup location</option>
                    {stops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Destination Stop</label>
                <div className="relative flex items-center">
                  <Navigation className="absolute left-3 text-slate-400 dark:text-slate-300" size={18} />
                  <select 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-700 dark:text-white"
                  >
                    <option value="" disabled>Select dropoff location</option>
                    {stops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={!passengerName || !origin || !destination}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200/50 dark:shadow-none transform transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Broadcast Request
              </button>
            </div>
          )}

          {status === 'searching' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-blue-100 dark:bg-blue-900/50 rounded-full p-4">
                  <Loader2 className="text-blue-600 dark:text-blue-400 animate-spin" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Broadcasting to Drivers</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Please wait while we match you with a driver heading from {stops.find(s => s.id === origin)?.name} to {stops.find(s => s.id === destination)?.name}...</p>
            </div>
          )}

          {status === 'matched' && (
            <div className="py-6 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="bg-sky-100 dark:bg-sky-900/40 rounded-full p-4 mb-4">
                <Car className="text-sky-600 dark:text-sky-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Driver Found!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center">A driver is found and is on the way to your pick up location.</p>
              
              <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Arrival</span>
                  <span className="font-semibold text-slate-900 dark:text-white">3 mins</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Driver Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{matchData?.driverName || 'Campus Driver'}</span>
                </div>
                {matchData?.vehicleNo && (
                  <>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Vehicle Info</span>
                      <span className="font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 rounded py-0.5 tracking-wider">{matchData?.vehicleNo}</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Route</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{matchData?.origin} &rarr; {matchData?.destination}</span>
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="py-6 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="bg-sky-100 dark:bg-sky-900/40 rounded-full p-4 mb-4">
                <MapPin className="text-sky-600 dark:text-sky-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 text-center">Ride Completed!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center">The driver has dropped you at your location. Thanks for using it!</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book Another Ride
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Passenger;
