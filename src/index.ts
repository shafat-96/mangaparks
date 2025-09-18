import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import router from './routes/route'
import { corsConfig } from './utils/cors-config'

config()

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(corsConfig)

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app