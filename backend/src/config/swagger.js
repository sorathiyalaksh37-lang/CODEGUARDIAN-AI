import swaggerJSDoc from "swagger-jsdoc";

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "CodeGuardian AI API",

            version: "1.0.0",

            description:
                "AI Powered GitHub Code Review Platform",

        },

        servers: [

            {
                url: "http://localhost:8000",
            },

        ],

    },

    apis: ["./src/routes/*.js"],

};

const swaggerSpec =
    swaggerJSDoc(options);

export default swaggerSpec;