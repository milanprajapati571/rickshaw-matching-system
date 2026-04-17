import { useState, useEffect } from 'react';
import { Lock, Shield, Trash2, Edit2, Plus, RefreshCw, User, Car, MapPin, Search } from 'lucide-react';

interface Stop {
  id: string;
  name: string;
}

interface AdminData {
  stops: Stop[];
  passengers: any[];
  drivers: any[];
  rides: any[];
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'passengers' | 'drivers' | 'rides' | 'stops'>('rides');
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Manage Stops State
  const [newStopName, setNewStopName] = useState('');
  const [editingStop, setEditingStop] = useState<Stop | null>(null);

  useEffect(() => {
    document.title = "CampusRide - Admin Portal";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Milan Prajapati" && password === "Milan.1234") {
      setIsAuthenticated(true);
      setAuthError('');
      fetchData();
    } else {
      setAuthError("Permission Denied, not identified as admin.");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api/admin/data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
    setIsLoading(false);
  };

  // Stop CRUD operations
  const addStop = async () => {
    if (!newStopName.trim()) return;
    try {
      await fetch((import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api/admin/stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStopName })
      });
      setNewStopName('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteStop = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this stop?")) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admin/stops/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const saveEditedStop = async () => {
    if (!editingStop) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admin/stops/${editingStop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingStop.name })
      });
      setEditingStop(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-full mb-4">
              <Shield size={36} className="text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Restricted Access</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Admin Name</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-700 dark:text-white"
                placeholder="Enter authorized name"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-700 dark:text-white"
                placeholder="Enter passphrase"
              />
            </div>

            {authError && (
              <p className="text-red-500 text-sm font-semibold flex flex-col items-center justify-center mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900">
                {authError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full mt-6 flex justify-center items-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95"
            >
              <Lock size={18} /> Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 w-full animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="text-red-500" /> Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {username}</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Syncing...' : 'Sync Database'}
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 px-4 gap-2 mb-6 hide-scrollbar border-b border-transparent">
        {[
          { id: 'rides', label: 'All Rides', icon: Search, count: data?.rides.length },
          { id: 'passengers', label: 'Passengers', icon: User, count: data?.passengers.length },
          { id: 'drivers', label: 'Drivers', icon: Car, count: data?.drivers.length },
          { id: 'stops', label: 'Manage Stops', icon: MapPin, count: data?.stops.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id 
              ? 'bg-blue-600 shadow-md text-white' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* Passgengers Tab */}
        {activeTab === 'passengers' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Active Passenger Connections</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data?.passengers.length ? data.passengers.map(p => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{p.name || 'Anonymous User'}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{p.email || 'No email provided'}</span>
                  <span className="text-xs text-slate-400 mt-3 font-mono">ID: {p.id}</span>
                </div>
              )) : <p className="text-slate-500">No recent passengers observed.</p>}
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Active Driver Connections</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {data?.drivers.length ? data.drivers.map(d => (
                 <div key={d.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{d.name}</span>
                     <span className="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded text-xs tracking-wider border border-sky-200 dark:border-sky-800">
                       {d.vehicleNo}
                     </span>
                   </div>
                   <span className="text-xs text-slate-400 mt-2 font-mono">Socket: {d.id}</span>
                 </div>
               )) : <p className="text-slate-500">No active drivers found.</p>}
            </div>
           </div>
        )}

        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-200 dark:border-slate-800">
               <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Global Ride Ledger</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                     <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                     <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Passenger</th>
                     <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Route</th>
                     <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Driver</th>
                     <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {data?.rides.map(ride => (
                     <tr key={ride.requestId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${  
                           ride.status === 'completed' ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400' :
                           ride.status === 'accepted' ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400' :
                           'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                         }`}>
                           {ride.status.toUpperCase()}
                         </span>
                       </td>
                       <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{ride.passengerName}</td>
                       <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                         <span className="font-semibold text-slate-800 dark:text-slate-200">{ride.origin}</span> &rarr; <span className="font-semibold text-slate-800 dark:text-slate-200">{ride.destination}</span>
                       </td>
                       <td className="p-4">
                         {ride.driverName ? (
                           <div className="flex flex-col">
                             <span className="font-medium text-slate-800 dark:text-slate-200">{ride.driverName}</span>
                             <span className="text-xs text-slate-400 dark:text-slate-500">{ride.vehicleNo}</span>
                           </div>
                         ) : <span className="text-slate-400 italic">Waiting...</span>}
                       </td>
                       <td className="p-4 text-sm text-slate-500 font-mono">
                         {new Date(ride.timestamp).toLocaleTimeString()}
                       </td>
                     </tr>
                   ))}
                   {!data?.rides.length && (
                     <tr><td colSpan={5} className="p-8 text-center text-slate-500">No rides logged since server start.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* Stops Tab */}
        {activeTab === 'stops' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Current Campus Stops</h2>
              
              <div className="space-y-3">
                {data?.stops.map((stop, i) => (
                  <div key={stop.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      
                      {editingStop?.id === stop.id ? (
                         <input 
                           type="text" 
                           value={editingStop.name}
                           onChange={e => setEditingStop({...editingStop, name: e.target.value})}
                           className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-500 rounded-lg outline-none text-slate-800 dark:text-white"
                           autoFocus
                         />
                      ) : (
                         <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{stop.name}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       {editingStop?.id === stop.id ? (
                         <button onClick={saveEditedStop} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold">Save</button>
                       ) : (
                         <button onClick={() => setEditingStop(stop)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                           <Edit2 size={18} />
                         </button>
                       )}
                       <button onClick={() => deleteStop(stop.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit">
               <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                 <Plus size={20} className="text-blue-500" /> New Stop
               </h2>
               <div className="space-y-4">
                 <input 
                   type="text" 
                   value={newStopName}
                   onChange={e => setNewStopName(e.target.value)}
                   placeholder="e.g. Science Block"
                   className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-white"
                   onKeyDown={e => e.key === 'Enter' && addStop()}
                 />
                 <button 
                   onClick={addStop}
                   disabled={!newStopName.trim()}
                   className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm disabled:opacity-50 transition-colors"
                 >
                   Add Place
                 </button>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                   * Changes to stops require passengers to reload their app to see the new locations in the dropdown.
                 </p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
