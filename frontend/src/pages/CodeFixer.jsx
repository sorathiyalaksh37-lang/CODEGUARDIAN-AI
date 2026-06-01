import React, {
  useState,
} from "react";

import axios
  from "axios";

import {
  FaCode,
  FaBug,
  FaShieldAlt,
  FaCopy,
} from "react-icons/fa";

const CodeFixer = () => {

  const [code,
    setCode] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [result,
    setResult] =
    useState(null);

  // SUBMIT
  const handleFix =
    async () => {

      try {

        setLoading(true);

        setResult(null);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.post(

            "http://localhost:8000/api/aifix/fix",

            { code },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        setResult(
          res.data.result
        );

      } catch (error) {

        console.log(error);

        alert(
          "AI Fix Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  // COPY
  const copyCode =
    () => {

      navigator.clipboard.writeText(
        result.fixedCode
      );

      alert(
        "Code Copied"
      );

    };

  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-10
      "
    >

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
          text-5xl
          font-black
          "
        >
          AI Code Fix Generator
        </h1>

        <p
          className="
          text-zinc-400
          mt-3
          "
        >
          Detect vulnerabilities and generate secure code fixes instantly.
        </p>

      </div>

      {/* INPUT */}

      <div
        className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-6
        "
      >

        <textarea

          value={code}

          onChange={(e) =>
            setCode(
              e.target.value
            )
          }

          placeholder="
Paste vulnerable code here...
          "

          className="
          w-full
          h-[300px]
          bg-black
          border
          border-zinc-700
          rounded-2xl
          p-5
          outline-none
          resize-none
          font-mono
          "

        />

        <button

          onClick={handleFix}

          disabled={loading}

          className="
          mt-5
          bg-green-500
          hover:bg-green-600
          text-black
          font-black
          px-8
          py-4
          rounded-2xl
          "

        >

          {
            loading
              ? "Analyzing..."
              : "Generate Secure Fix"
          }

        </button>

      </div>

      {/* RESULT */}

      {
        result && (

          <div className="mt-10 space-y-6">

            {/* VULNERABILITY */}

            <div
              className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              "
            >

              <div
                className="
                flex
                items-center
                gap-3
                mb-4
                "
              >

                <FaBug
                  className="
                  text-red-400
                  text-2xl
                  "
                />

                <h2
                  className="
                  text-2xl
                  font-black
                  "
                >
                  Vulnerability
                </h2>

              </div>

              <p>
                {
                  result.vulnerability
                }
              </p>

            </div>

            {/* EXPLANATION */}

            <div
              className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              "
            >

              <div
                className="
                flex
                items-center
                gap-3
                mb-4
                "
              >

                <FaShieldAlt
                  className="
                  text-green-400
                  text-2xl
                  "
                />

                <h2
                  className="
                  text-2xl
                  font-black
                  "
                >
                  Explanation
                </h2>

              </div>

              <p
                className="
                leading-8
                text-zinc-300
                "
              >
                {
                  result.explanation
                }
              </p>

            </div>

            {/* FIXED CODE */}

            <div
              className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              "
            >

              <div
                className="
                flex
                justify-between
                items-center
                mb-5
                "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >

                  <FaCode
                    className="
                    text-blue-400
                    text-2xl
                    "
                  />

                  <h2
                    className="
                    text-2xl
                    font-black
                    "
                  >
                    Secure Fixed Code
                  </h2>

                </div>

                <button

                  onClick={copyCode}

                  className="
                  flex
                  items-center
                  gap-2
                  bg-green-500
                  text-black
                  px-5
                  py-3
                  rounded-xl
                  font-bold
                  "

                >

                  <FaCopy />

                  Copy

                </button>

              </div>

              <pre
                className="
                bg-black
                border
                border-zinc-700
                p-5
                rounded-2xl
                overflow-x-auto
                text-sm
                "
              >

                <code>
                  {
                    result.fixedCode
                  }
                </code>

              </pre>

            </div>

          </div>

        )
      }

    </div>

  );

};

export default CodeFixer;