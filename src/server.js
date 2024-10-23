const app = require('./app');
const port = app.get('port');
const swaggerUi = require("swagger-ui-express");
const express = require('express')
const swaggerJsDoc = require("swagger-jsdoc");
 
 
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Api de Tarefas",
            version: "1.0.0",
            description: "Api Crud"
        },
        servers: [{url: "http://localhost:3001"}],
       
    },
    apis: [`${__dirname}/routes/*js`],
};
 
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(express.json())
app.set('port', process.env.PORT || 3005);
app.listen(port, () => console.log(`Rodando na porta ${port}`));


