import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://yeneta-learnhub.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId.toString());
    });
  });
};

export const emitNotification = (userId, payload) => {
  if (!io) return;
  io.to(userId.toString()).emit("notification", payload);
};
