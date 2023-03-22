const express = require('express');
const router = express.Router();

//! swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./src/docs/endpoints.yaml');

router.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

module.exports = router;
