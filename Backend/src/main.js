import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { config } from '../config/config.js'
import authRouter from './routes/authRoutes.js'
import filesRouter from './routes/filesRoutes.js'
import passwordsRoutes from './routes/passwordsRoutes.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ——— Setup de __dirname en ESM ———
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ——— Lee el JSON generado ———
const swaggerOutputPath = path.resolve(__dirname, '../src/utils/swagger-output.json');
const swaggerFile = JSON.parse(
  fs.readFileSync(swaggerOutputPath, 'utf-8')
);


const app = express()

// Monta Swagger UI en /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', authRouter)
app.use('/files', filesRouter)

app.use('/credentials', passwordsRoutes)

app.listen(config.port, () => {
  return console.log("Server is running on port " + config.port)
})
