import axios from "axios";

const geminiReview = async (code) => {

  try {

    // LIMIT CODE SIZE
    const optimizedCode = code.substring(0, 3000);

    const prompt = `
You are an expert senior software engineer.

Analyze this code shortly and professionally.

Check:
1. Security issues
2. Performance issues
3. Clean code
4. Best practices

Give:
- Severity
- Fixes
- Better implementation

CODE:
${optimizedCode}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",

        max_tokens: 700,

        temperature: 0.3,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {

    console.log(
      "OPENROUTER ERROR:",
      error.response?.data || error.message
    );

    return "AI Review Failed";
  }
};

export default geminiReview;