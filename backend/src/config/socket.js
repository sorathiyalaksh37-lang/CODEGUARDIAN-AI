import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: "*",
    },

  });

  io.on("connection", (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );

    // USER ONLINE

    socket.on(
      "user-online",
      (userId) => {

        onlineUsers.set(
          userId,
          socket.id
        );

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );

      }
    );

    // JOIN TEAM

    socket.on(
      "join-team",
      (teamId) => {

        socket.join(teamId);

      }
    );

    // SEND MESSAGE

    socket.on(
      "send-message",
      ({ teamId, message }) => {

        io.to(teamId).emit(
          "receive-message",
          message
        );

      }
    );

    // DISCONNECT

    socket.on(
      "disconnect",
      () => {

        for (
          const [
            userId,
            socketId,
          ]
          of onlineUsers.entries()
        ) {

          if (
            socketId === socket.id
          ) {

            onlineUsers.delete(
              userId
            );

            break;

          }

        }

        io.emit(
          "online-users",
          Array.from(
            onlineUsers.keys()
          )
        );

        console.log(
          "User Disconnected"
        );

      }
    );

  });

};

export const getIO = () => io;