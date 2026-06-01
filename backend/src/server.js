import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";

import { Server } from "socket.io";

import connectDB from "./config/db.js";
import "./config/redis.js";

import passport from "passport";

import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import aiFixRoutes from "./routes/aiFixRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

connectDB();

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(passport.initialize());

app.get("/", (req, res) => {

    res.send(
        "CodeGuardian AI API Running"
    );

});

/* ROUTES */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/auth",
    oauthRoutes
);

app.use(
    "/api/review",
    reviewRoutes
);

app.use(
    "/api/github",
    githubRoutes
);

app.use(
    "/api/report",
    reportRoutes
);

app.use(
    "/api/ai",
    aiRoutes
);

app.use(
    "/api/aifix",
    aiFixRoutes
);

app.use(
    "/api/teams",
    teamRoutes
);

app.use(
    "/api/chat",
    chatRoutes
);

/* SWAGGER */

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/* SERVER */

const server =
    http.createServer(app);

/* SOCKET.IO */

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST",
        ],

    },

});

/* SOCKET EVENTS */

io.on(
    "connection",
    (socket) => {

        console.log(
            "User Connected:",
            socket.id
        );

        socket.on(
            "join-team",
            (teamId) => {

                socket.join(teamId);

            }
        );

        socket.on(
            "send-message",
            ({ teamId, message }) => {

                io.to(teamId).emit(
                    "receive-message",
                    message
                );

            }
        );
        socket.on(
            "disconnect",
            () => {

                console.log(
                    "User Disconnected"
                );

            }
        );

    }
);

const PORT =
    process.env.PORT || 5000;

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on ${PORT}`
        );

    }
);