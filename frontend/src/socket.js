import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error);
});

export default socket;