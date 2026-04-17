import { useState, useEffect } from 'react';
import { socket } from '../lib/socket';
import { Users, CheckCircle2, UserCircle2 } from 'lucide-react';

interface RideRequest {
  requestId: string;
  passengerId: string;
  passengerName?: string;
  origin: string;
  destination: string;
  timestamp: string;
}

const Driver = () => {
  useEffect(() => {
    document.title = "CampusRide - Driver";
  }, []);

  const [setupStage, setSetupStage] = useState<'auth' | 'portal'>(() => {
      return sessionStorage.getItem('driverName') && sessionStorage.getItem('vehicleNo') ? 'portal' : 'auth';
  });
  const [driverName, setDriverName] = useState(() => sessionStorage.getItem('driverName') || '');
  const [vehicleNo, setVehicleNo] = useState(() => sessionStorage.getItem('vehicleNo') || '');

  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [availableSeats, setAvailableSeats] = useState<number>(() => {
      const saved = sessionStorage.getItem('driverSeats');
      return saved ? parseInt(saved) : 4;
  });
  const [activeRides, setActiveRides] = useState<RideRequest[]>(() => {
      const saved = sessionStorage.getItem('activeRides');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('driverSeats', availableSeats.toString());
    sessionStorage.setItem('activeRides', JSON.stringify(activeRides));
  }, [availableSeats, activeRides]);

  useEffect(() => {
    sessionStorage.setItem('driverName', driverName);
    sessionStorage.setItem('vehicleNo', vehicleNo);
  }, [driverName, vehicleNo]);

  useEffect(() => {
    socket.on('new_ride_request', (data: RideRequest) => {
      // Don't show request if we already accepted it
      if (!activeRides.some(r => r.requestId === data.requestId)) {
        setRequests(prev => {
          if (prev.some(r => r.requestId === data.requestId)) return prev;
          return [data, ...prev];
        });
      }
    });

    socket.on('request_accepted', (data: RideRequest) => {
      // Whenever ANY driver accepts a ride, remove it from our pool if it exists
      setRequests(prev => prev.filter(r => r.requestId !== data.requestId));
    });

    return () => {
      socket.off('new_ride_request');
      socket.off('request_accepted');
    };
  }, [activeRides]);

  const handleAccept = (request: RideRequest) => {
    if (availableSeats <= 0) {
        alert("No seats available!");
        return;
    }
    
    // Optimistically update
    setAvailableSeats(prev => prev - 1);
    setActiveRides(prev => [...prev, request]);
    
    // Remove from active requests pool
    setRequests(prev => prev.filter(r => r.requestId !== request.requestId));

    // Notify backend
    socket.emit('accept_request', {
      ...request,
      driverId: socket.id,
      driverName,
      vehicleNo
    });
  };

  const handleCompleteRide = (ride: RideRequest) => {
      setActiveRides(prev => prev.filter(r => r.requestId !== ride.requestId));
      setAvailableSeats(prev => Math.min(prev + 1, 4));
      
      // Notify passenger
      socket.emit('complete_ride', ride);
  }



  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        {setupStage === 'auth' ? (
          <div className="p-8 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Driver Authentication</h2>
              <p className="text-slate-500 dark:text-slate-400">Enter your details to access the portal</p>
            </div>
            
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Vehicle Auto Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. MH 12 AB 1234"
                  value={vehicleNo}
                  onChange={e => setVehicleNo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white transition-all"
                />
              </div>

              <button 
                onClick={() => {
                  if (!driverName.trim()) { alert("Name is required"); return; }
                  if (!vehicleNo.trim()) { alert("Vehicle auto number is required"); return; }
                  setSetupStage('portal');
                }}
                disabled={!driverName || !vehicleNo}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 mt-4 disabled:opacity-50"
              >
                Enter Portal
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-blue-600 dark:bg-blue-900 border-b border-transparent dark:border-blue-800 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-1">Driver Portal</h2>
                <div className="flex items-center gap-3">
                  <p className="text-blue-100 dark:text-blue-200 text-sm">Welcome, {driverName}</p>
                  <span className="bg-blue-500 dark:bg-blue-800 text-xs px-2 py-0.5 rounded-full border border-blue-400 dark:border-blue-700">{vehicleNo}</span>
                </div>
              </div>
          <div className="flex flex-col items-center bg-blue-500 dark:bg-blue-800 rounded-xl p-3 border border-blue-400 dark:border-blue-700">
            <Users size={20} className="mb-1" />
            <div className="font-bold">{availableSeats}/4</div>
            <div className="text-[10px] uppercase tracking-wider opacity-80">Seats</div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[400px]">
          {activeRides.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-sky-800 dark:text-sky-400 text-lg border-b border-sky-200 dark:border-sky-900/50 pb-2">Active Rides ({activeRides.length})</h3>
              {activeRides.map((ride, index) => (
                <div key={ride.requestId} className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-sky-600 dark:text-sky-400" size={20} />
                        <h4 className="font-bold text-sky-700 dark:text-sky-300">Passenger: {ride.passengerName || `User ${index + 1}`}</h4>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative">
                     <div className="absolute left-[11px] top-8 bottom-8 w-px bg-sky-200 dark:bg-sky-800"></div>
                     <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-700 border-4 border-white dark:border-slate-800 flex-shrink-0 z-10 shadow-sm"></div>
                       <div>
                         <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Pickup</p>
                         <p className="font-medium text-slate-900 dark:text-slate-100">{ride.origin}</p>
                       </div>
                     </div>
                     <div className="h-4"></div>
                     <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-slate-800 flex-shrink-0 z-10 shadow-sm"></div>
                       <div>
                         <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">Dropoff</p>
                         <p className="font-medium text-slate-900 dark:text-slate-100">{ride.destination}</p>
                       </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleCompleteRide(ride)}
                    className="w-full mt-6 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600 text-white rounded-xl font-bold shadow-md transition-colors text-sm"
                   >
                     Drop Off Passenger
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Live Requests</h3>
            {requests.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-1 px-3 rounded-full text-xs font-bold animate-pulse">
                    {requests.length} New
                </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <div className="bg-white dark:bg-slate-900 shadow-sm dark:border dark:border-slate-800 p-4 rounded-full mb-4">
                 <UserCircle2 size={48} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p>No active requests right now</p>
              <p className="text-sm">Listening for passengers...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.requestId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Passanger: <span className="text-slate-800 dark:text-slate-100">{req.passengerName || "Unknown User"}</span></p>
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">{req.origin}</span>
                       <span className="text-slate-400 dark:text-slate-500 font-medium">&rarr;</span>
                       <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">{req.destination}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Requested a few seconds ago</p>
                  </div>
                  
                  <button 
                    onClick={() => handleAccept(req)}
                    disabled={availableSeats <= 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-transform active:scale-95"
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Driver;
