import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import paymentsRoutes, { registerStripeWebhook } from './routes/payments.js'
import { ensureConnection } from './db.js'

const app = express()
const PORT = Number(process.env.PORT || 4000)

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)

registerStripeWebhook(app)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

app.use('/api/auth', authRoutes)
app.use('/api/payments', paymentsRoutes)

ensureConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL:', err)
    process.exit(1)
  })


