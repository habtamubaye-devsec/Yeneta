import { Server } from "socket.io";

let io;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) return true;

  // Dev convenience: allow any localhost port
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;

  return false;
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error(`Socket.IO CORS blocked origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    },
  });

  io.on("connection", socket => {
    socket.on("join", userId => {
      socket.join(userId);
    });
  });
};

export const emitNotification = (userId, payload) => {
  io.to(userId.toString()).emit("notification", payload);
};
