import Groq
  from "groq-sdk";

const groq =
  new Groq({

    apiKey:
      process.env.GROQ_API_KEY,

  });

const generateSecureFix =
  async (code) => {

    try {

      const prompt = `

You are an expert cybersecurity engineer.

Analyze the following code carefully.

Tasks:
1. Detect vulnerabilities
2. Explain security issues
3. Generate secure fixed code
4. Give professional recommendations

Return ONLY valid JSON.

Format:

{
  "vulnerability": "",
  "severity": "",
  "explanation": "",
  "fixedCode": "",
  "recommendations": []
}

CODE:

${code}

`;

      const completion =
        await groq.chat.completions.create({

          model:
            "llama-3.3-70b-versatile",

          messages: [

            {
              role:
                "user",

              content:
                prompt,
            },

          ],

          temperature: 0.2,

        });

      const text =
        completion.choices[0]
          ?.message?.content;

      const cleanText =
        text
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      return JSON.parse(
        cleanText
      );

    } catch (error) {

      console.log(
        "AI FIX ERROR:",
        error.message
      );

      return {

        vulnerability:
          "Unknown",

        severity:
          "Low",

        explanation:
          "AI analysis failed",

        fixedCode:
          code,

        recommendations: [],

      };

    }

  };

export default
  generateSecureFix;