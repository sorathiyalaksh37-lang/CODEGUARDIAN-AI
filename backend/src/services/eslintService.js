import { ESLint } from "eslint";

const eslint = new ESLint();

const analyzeCode = async (code) => {

  try {

    const results = await eslint.lintText(code);

    const issues = results[0].messages.map(
      (msg) => ({
        rule: msg.ruleId,
        message: msg.message,
        line: msg.line,

        severity:
          msg.severity === 2
            ? "High"
            : "Medium",
      })
    );

    return issues;

  } catch (error) {

    console.log(error);

    return [];

  }
};

export default analyzeCode;