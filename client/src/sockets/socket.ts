import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

// Central Socket.IO client. Exported as `socket` per project requirement.
// Uses cookie-based auth (JWT in httpOnly cookie) via `withCredentials`.
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});
