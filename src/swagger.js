import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation for your application'
    },
    servers: [
      {
        url: `http://localhost:${6000}`, // Replace with your actual server URL
        description: 'Development server'
      }
    ]
  },
  apis: ["./router/*.ts"] // Update this pattern to match your actual route files
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
