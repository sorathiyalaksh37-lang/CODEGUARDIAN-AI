import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("scan-progress", (data) => {
    console.log("PROGRESS:", data);
});

socket.on("scan-completed", (data) => {
    console.log("COMPLETED:", data);
});