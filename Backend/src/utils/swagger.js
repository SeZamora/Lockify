// swagger.js
import swaggerAutogen from 'swagger-autogen';

const swaggerGenerator = swaggerAutogen();

const doc = {
  info: {
    title: 'Mi API',
    version: '1.0.0',
    description: 'Documentación automática',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  // (opcional) define componentes, seguridad, etc.
};

const outputFile     = './swagger-output.json';
const endpointsFiles = ['../main.js']; // o donde definas tus rutas

swaggerGenerator(outputFile, endpointsFiles, doc).then(() => {
  // Arranca tu servidor tras generar la spec
  import('../main.js');
});
