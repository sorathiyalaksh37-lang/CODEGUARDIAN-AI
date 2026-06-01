import generateSecureFix
  from "../services/codeFixService.js";

export const fixCode =
  async (req, res) => {

    try {

      const { code } =
        req.body;

      if (!code) {

        return res.status(400).json({

          success: false,

          message:
            "Code is required",

        });

      }

      const result =
        await generateSecureFix(
          code
        );

      return res.json({

        success: true,

        result,

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