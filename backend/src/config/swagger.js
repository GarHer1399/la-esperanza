const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API La Esperanza",
      version: "1.0.0",
      description: "Documentación de endpoints del sistema La Esperanza",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;