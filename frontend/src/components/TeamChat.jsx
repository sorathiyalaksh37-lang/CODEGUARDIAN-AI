import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import socket from "../socket";

import {
  FaPaperPlane,
  FaRobot,
  FaCircle,
} from "react-icons/fa";

const TeamChat = ({
  teamId,
  members = [],
}) => {

  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);

  const [typingUser,
    setTypingUser] =
    useState("");

  const token =
    localStorage.getItem(
      "token"
    );

  const messagesEndRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  // USER

  let user = {};
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.log("Error parsing user:", error);
  }
  
  // AUTO SCROLL

  const scrollToBottom =
    () => {

      messagesEndRef.current?.
        scrollIntoView({
          behavior: "smooth",
        });

    };

  // FETCH MESSAGES

  const fetchMessages =
    async () => {

      try {

        const { data } =
          await axios.get(

            `http://localhost:8000/api/chat/${teamId}`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        setMessages(
          data.messages || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  // SOCKET

  useEffect(() => {

    if (!teamId) return;

    fetchMessages();

    // JOIN ROOM

    socket.emit(
      "join-team",
      teamId
    );

    // ONLINE

    if (user?._id) {

      socket.emit(
        "user-online",
        user._id
      );

    }

    // CLEAN EVENTS

    socket.off(
      "receive-message"
    );

    socket.off(
      "online-users"
    );

    socket.off(
      "user-typing"
    );

    // RECEIVE MESSAGE

    socket.on(
      "receive-message",
      (message) => {

        setMessages(
          (prev) => {

            const exists =
              prev.find(
                (m) =>
                  m._id ===
                  message._id
              );

            if (exists)
              return prev;

            return [
              ...prev,
              message,
            ];

          }
        );

      }
    );

    // ONLINE USERS

    socket.on(
      "online-users",
      (users) => {

        setOnlineUsers(
          users
        );

      }
    );

    // TYPING

    socket.on(
      "user-typing",
      (email) => {

        setTypingUser(
          email
        );

        setTimeout(() => {

          setTypingUser("");

        }, 2000);

      }
    );

    return () => {

      socket.off(
        "receive-message"
      );

      socket.off(
        "online-users"
      );

      socket.off(
        "user-typing"
      );

    };

  }, [teamId]);

  // SCROLL

  useEffect(() => {

    scrollToBottom();

  }, [messages]);

  // SEND MESSAGE

  const sendMessage =
    async () => {

      try {

        if (
          !text.trim()
        ) return;

        const tempText =
          text;

        setText("");

        const { data } =
          await axios.post(

            "http://localhost:8000/api/chat/send",

            {

              teamId,

              text: tempText,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        socket.emit(
          "send-message",
          {

            teamId,

            message:
              data.message,

          }
        );

      } catch (error) {

        console.log(error);

      }

    };

  // TYPING EVENT

  const handleTyping =
    (e) => {

      setText(
        e.target.value
      );

      socket.emit(
        "typing",
        {

          teamId,

          email:
            user.email,

        }
      );

      clearTimeout(
        typingTimeoutRef.current
      );

    };

  return (

    <div
      className="
      bg-zinc-950
      border
      border-zinc-800
      rounded-[30px]
      overflow-hidden
      mt-8
      "
    >

      {/* HEADER */}

      <div
        className="
        flex
        items-center
        gap-4
        px-6
        py-5
        border-b
        border-zinc-800
        "
      >

        <div
          className="
          w-14
          h-14
          rounded-2xl
          bg-green-500
          flex
          items-center
          justify-center
          "
        >

          <FaRobot
            className="
            text-black
            text-2xl
            "
          />

        </div>

        <div>

          <h2
            className="
            text-3xl
            font-black
            "
          >
            Team Chat
          </h2>

          <p
            className="
            text-zinc-500
            "
          >
            Enterprise realtime workspace
          </p>

        </div>

      </div>

      {/* ONLINE USERS */}

      <div
        className="
        px-6
        py-4
        border-b
        border-zinc-800
        "
      >

        <h3
          className="
          text-sm
          text-zinc-500
          mb-3
          "
        >
          ONLINE MEMBERS
        </h3>

        <div
          className="
          flex
          flex-wrap
          gap-3
          "
        >

          {
            members.map(
              (member) => (

                <div

                  key={member._id}

                  className="
                  bg-black
                  border
                  border-zinc-800
                  rounded-xl
                  px-4
                  py-2
                  flex
                  items-center
                  gap-3
                  "

                >

                  <FaCircle
                    className={
                      onlineUsers.includes(
                        member._id
                      )
                        ? "text-green-500 text-xs"
                        : "text-zinc-600 text-xs"
                    }
                  />

                  <span
                    className="
                    text-sm
                    "
                  >
                    {member.email}
                  </span>

                </div>

              )
            )
          }

        </div>

      </div>

      {/* CHAT */}

      <div
        className="
        h-[500px]
        overflow-y-auto
        p-5
        space-y-4
        "
      >

        {
          messages.map(
            (msg) => (

              <div

                key={msg._id}

                className={`
                max-w-[85%]
                border
                rounded-3xl
                p-5
                ${msg.sender?._id ===
                    user?._id
                    ? `
                    ml-auto
                    bg-green-500/10
                    border-green-500/30
                    `
                    : `
                    bg-black
                    border-zinc-800
                    `
                  }
                `}
              >

                <div
                  className="
                  flex
                  items-center
                  justify-between
                  mb-3
                  gap-5
                  "
                >

                  <h3
                    className="
                    text-green-400
                    font-bold
                    text-sm
                    "
                  >
                    {
                      msg.sender?.email
                    }
                  </h3>

                  <span
                    className="
                    text-xs
                    text-zinc-500
                    "
                  >

                    {
                      new Date(
                        msg.createdAt
                      ).toLocaleTimeString()
                    }

                  </span>

                </div>

                <p
                  className="
                  text-zinc-200
                  break-words
                  leading-7
                  "
                >
                  {msg.text}
                </p>

              </div>

            )
          )
        }

        {/* TYPING */}

        {
          typingUser && (

            <div
              className="
              text-sm
              text-zinc-500
              italic
              px-2
              "
            >
              {typingUser}
              {" "}
              is typing...
            </div>

          )
        }

        <div
          ref={messagesEndRef}
        />

      </div>

      {/* INPUT */}

      <div
        className="
        border-t
        border-zinc-800
        p-5
        flex
        gap-4
        "
      >

        <input

          value={text}

          onChange={
            handleTyping
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              sendMessage();

            }

          }}

          placeholder="
Send message...
          "

          className="
          flex-1
          bg-black
          border
          border-green-500
          rounded-2xl
          px-5
          py-4
          outline-none
          text-white
          "

        />

        <button

          onClick={
            sendMessage
          }

          className="
          bg-green-500
          hover:bg-green-600
          text-black
          font-black
          px-8
          rounded-2xl
          flex
          items-center
          gap-3
          transition-all
          "

        >

          <FaPaperPlane />

          Send

        </button>

      </div>

    </div>

  );

};

export default TeamChat;