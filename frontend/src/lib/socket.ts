import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.PROD ? undefined : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

export const socket = io(URL as string, {
  autoConnect: true
});
