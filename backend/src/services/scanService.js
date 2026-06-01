import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const scanSingleFile = async (file, content) => {

  try {

const prompt = `
You are an expert senior security engineer.

Analyze this source code carefully.

Return JSON only.

Required JSON format:

{
  "severity": "Low",
  "score": {
    "overall": 85
  },
  "review": "Short explanation",
  "fixes": [
    "Fix 1",
    "Fix 2"
  ]
}

Rules:
- Detect security vulnerabilities
- Detect bad coding practices
- Detect performance issues
- Detect exposed secrets
- Detect unsafe functions
- Give realistic scores
- High score = safer code
- Low score = risky code

Code:
${content}
`;

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,

      });

    const response =
      completion.choices[0]?.message?.content;

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed = JSON.parse(cleaned);

    return {

      fileName: file.path,

      severity:
        parsed.severity || "Low",

      score: {
        overall:
          parsed.score?.overall || 50,
      },

      review:
        parsed.review || "No review",

      fixes:
        parsed.fixes || [],

    };

  } catch (error) {

    console.log(
      "AI Scan Error:",
      error.message
    );

    return {

      fileName: file.path,

      severity: "Low",

      score: {
        overall: 50,
      },

      review:
        "AI scan failed",

      fixes: [],

    };

  }

};

export default scanSingleFile;