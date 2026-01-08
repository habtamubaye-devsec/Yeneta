import { io } from "socket.io-client";

// Central Socket.IO client. Exported as `socket` per project requirement.
// Uses cookie-based auth (JWT in httpOnly cookie) via `withCredentials`.
export const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: true,
});
