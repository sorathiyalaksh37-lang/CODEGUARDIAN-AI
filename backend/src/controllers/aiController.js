import Groq
  from "groq-sdk";

const groq =
  new Groq({

    apiKey:
      process.env.GROQ_API_KEY,

  });

export const askAiAssistant =
  async (req, res) => {

    try {

      const { question } =
        req.body;

      if (!question) {

        return res.status(400).json({

          success: false,

          message:
            "Question required",

        });

      }

      const completion =
        await groq.chat.completions.create({

          messages: [

            {

              role: "system",

              content:
                `
                You are an expert cybersecurity AI assistant.
                Help developers fix vulnerabilities professionally.
                Explain clearly with secure coding practices.
                `,

            },

            {

              role: "user",

              content:
                question,

            },

          ],

          model:
            "llama-3.3-70b-versatile",

        });

      const answer =
        completion
          ?.choices?.[0]
          ?.message
          ?.content;

      return res.json({

        success: true,

        answer,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };