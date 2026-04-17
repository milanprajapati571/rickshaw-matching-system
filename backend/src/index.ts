import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Global Memory State for Admin Tracking
let stops = [
  { id: '1', name: 'Library' },
  { id: '2', name: 'Boys Hostel' },
  { id: '3', name: 'Girls Hostel' },
  { id: '4', name: 'Canteen' },
  { id: '5', name: 'Main Building' }
];

let activeRequests: any[] = [];
let allRides: any[] = [];
const passengers = new Map<string, any>();
const drivers = new Map<string, any>();

// General Stops API 
app.get('/api/stops', (req, res) => {
  return res.json(stops);
});

// Admin REST APIs
app.get('/api/admin/data', (req, res) => {
  res.json({
    stops,
    passengers: Array.from(passengers.values()),
    drivers: Array.from(drivers.values()),
    rides: allRides
  });
});

app.post('/api/admin/stops', (req, res) => {
  const newStop = { id: Math.random().toString(36).substring(7), name: req.body.name };
  stops.push(newStop);
  res.json(newStop);
});

app.put('/api/admin/stops/:id', (req, res) => {
  const idx = stops.findIndex(s => s.id === req.params.id);
  if(idx !== -1) {
    stops[idx].name = req.body.name;
    return res.json(stops[idx]);
  }
  res.status(404).send('Not found');
});

app.delete('/api/admin/stops/:id', (req, res) => {
  stops = stops.filter(s => s.id !== req.params.id);
  res.json({ success: true });
});

// Socket.io integration
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send over existing active requests to new connection
  activeRequests.forEach(req => {
      socket.emit('new_ride_request', req);
  });

  socket.on('broadcast_request', (data) => {
    console.log('Ride request received:', data);
    
    // Register/update passenger in memory
    passengers.set(data.passengerId, { 
      id: data.passengerId, 
      name: data.passengerName, 
      email: data.passengerEmail 
    });

    const newRequest = { ...data, requestId: Math.random().toString(36).substring(7), status: 'pending' };
    activeRequests.push(newRequest);
    allRides.push(newRequest);
    
    // Broadcast the request to all drivers
    io.emit('new_ride_request', newRequest);
  });

  socket.on('accept_request', (data) => {
    console.log('Driver accepted request:', data);
    
    // Register/update driver in memory
    drivers.set(data.driverId, {
      id: data.driverId,
      name: data.driverName,
      vehicleNo: data.vehicleNo
    });

    // Remove from active pending
    activeRequests = activeRequests.filter(req => req.requestId !== data.requestId);
    
    // Track ride acceptance
    const ride = allRides.find(r => r.requestId === data.requestId);
    if(ride) {
      ride.status = 'accepted';
      ride.driverId = data.driverId;
      ride.driverName = data.driverName;
      ride.vehicleNo = data.vehicleNo;
    }

    // Notify the passenger that their request was accepted
    io.emit('request_accepted', data);
  });

  socket.on('complete_ride', (data) => {
    console.log('Ride completed:', data);
    
    // Track ride completion
    const ride = allRides.find(r => r.requestId === data.requestId);
    if (ride) ride.status = 'completed';

    io.emit('ride_completed', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
