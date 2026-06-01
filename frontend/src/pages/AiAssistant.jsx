import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import axios
  from "axios";

import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

const AiAssistant = () => {

  const navigate =
    useNavigate();

  const messagesEndRef =
    useRef(null);

  const [question,
    setQuestion] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [messages,
    setMessages] =
    useState([

      {

        role: "assistant",

        content:
          `
Welcome to CODEGUARDIAN AI Assistant 🚀

Ask anything related to:

• SQL Injection
• JWT Security
• API Protection
• XSS Attacks
• Secure Coding
• Vulnerability Fixes
• Authentication Security
• Node.js Security

I will help you fix vulnerabilities professionally.
          `,

      },

    ]);

  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior:
          "smooth",

      });

  }, [messages]);

  // SEND MESSAGE
  const askAI =
    async () => {

      if (
        !question.trim()
      )
        return;

      const userMessage = {

        role: "user",

        content: question,

      };

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      const currentQuestion =
        question;

      setQuestion("");

      setLoading(true);

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.post(

            "http://localhost:8000/api/ai/chat",

            {

              question:
                currentQuestion,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        const aiMessage = {

          role:
            "assistant",

          content:
            res.data.answer,

        };

        setMessages(
          (prev) => [
            ...prev,
            aiMessage,
          ]
        );

      } catch (error) {

        console.log(error);

        setMessages(
          (prev) => [

            ...prev,

            {

              role:
                "assistant",

              content:
                "AI server error. Please try again.",

            },

          ]
        );

      } finally {

        setLoading(false);

      }

    };

  // ENTER KEY
  const handleKeyPress =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        askAI();

      }

    };

  return (

    <div
      className="
      h-screen
      bg-black
      text-white
      flex
      flex-col
      overflow-hidden
      "
    >

      {/* HEADER */}

      <div
        className="
        border-b
        border-zinc-800
        px-6
        py-5
        flex
        items-center
        justify-between
        bg-black
        "
      >

        <div
          className="
          flex
          items-center
          gap-4
          "
        >

          <div
            className="
            w-14
            h-14
            rounded-2xl
            bg-green-500
            text-black
            flex
            items-center
            justify-center
            text-2xl
            "
          >

            <FaRobot />

          </div>

          <div>

            <h1
              className="
              text-3xl
              font-black
              "
            >
              AI Security Assistant
            </h1>

            <p
              className="
              text-zinc-400
              mt-1
              "
            >
              Professional AI Vulnerability Expert
            </p>

          </div>

        </div>

        {/* BACK */}

        <button

          onClick={() =>
            navigate("/")
          }

          className="
          flex
          items-center
          gap-3
          bg-zinc-900
          border
          border-zinc-700
          hover:border-green-500
          px-5
          py-3
          rounded-2xl
          transition-all
          "

        >

          <FaArrowLeft />

          Dashboard

        </button>

      </div>

      {/* CHAT AREA */}

      <div
        className="
        flex-1
        overflow-y-auto
        px-6
        py-8
        "
      >

        <div
          className="
          max-w-5xl
          mx-auto
          space-y-8
          "
        >

          {
            messages.map(
              (
                msg,
                index
              ) => (

                <div

                  key={index}

                  className={`
                  flex
                  ${
                    msg.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                  `}

                >

                  <div
                    className={`
                    max-w-3xl
                    rounded-3xl
                    px-6
                    py-5
                    shadow-xl
                    ${
                      msg.role ===
                      "user"
                        ? `
                          bg-green-500
                          text-black
                        `
                        : `
                          bg-zinc-900
                          border
                          border-zinc-800
                        `
                    }
                    `}
                  >

                    {/* TOP */}

                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      mb-4
                      "
                    >

                      <div
                        className="
                        text-xl
                        "
                      >

                        {
                          msg.role ===
                          "user"
                            ? (
                              <FaUser />
                            )
                            : (
                              <FaRobot />
                            )
                        }

                      </div>

                      <p
                        className="
                        font-black
                        text-lg
                        "
                      >

                        {
                          msg.role ===
                          "user"
                            ? "You"
                            : "CODEGUARDIAN AI"
                        }

                      </p>

                    </div>

                    {/* MESSAGE */}

                    <p
                      className="
                      whitespace-pre-wrap
                      leading-8
                      text-[16px]
                      "
                    >
                      {msg.content}
                    </p>

                  </div>

                </div>

              )
            )
          }

          {/* LOADING */}

          {
            loading && (

              <div
                className="
                flex
                justify-start
                "
              >

                <div
                  className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-3xl
                  px-6
                  py-5
                  "
                >

                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                  >

                    <FaRobot />

                    <p>
                      AI Thinking...
                    </p>

                  </div>

                </div>

              </div>

            )
          }

          <div
            ref={
              messagesEndRef
            }
          />

        </div>

      </div>

      {/* INPUT AREA */}

      <div
        className="
        border-t
        border-zinc-800
        bg-black
        px-6
        py-5
        "
      >

        <div
          className="
          max-w-5xl
          mx-auto
          "
        >

          <div
            className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            flex
            items-end
            p-4
            gap-4
            "
          >

            {/* TEXTAREA */}

            <textarea

              rows={1}

              value={question}

              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }

              onKeyDown={
                handleKeyPress
              }

              placeholder="
              Ask security question...
              "

              className="
              flex-1
              bg-transparent
              resize-none
              outline-none
              text-white
              max-h-40
              overflow-y-auto
              text-lg
              px-2
              py-2
              "

            />

            {/* SEND */}

            <button

              onClick={askAI}

              disabled={loading}

              className="
              w-14
              h-14
              rounded-2xl
              bg-green-500
              hover:bg-green-600
              text-black
              flex
              items-center
              justify-center
              text-xl
              transition-all
              "

            >

              <FaPaperPlane />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default AiAssistant;