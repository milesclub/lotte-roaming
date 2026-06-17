import express from 'express'
import cors from 'cors'
import { config, kakaoEnabled, portoneEnabled, smdpEnabled } from './config'
import auth from './routes/auth'
import catalog from './routes/catalog'
import orders from './routes/orders'
import payments from './routes/payments'
import esim from './routes/esim'
import push from './routes/push'

const app = express()

app.use(cors({ origin: config.clientOrigin, credentials: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    integrations: {
      kakao: kakaoEnabled ? 'live' : 'mock',
      portone: portoneEnabled ? 'live' : 'mock',
      smdp: smdpEnabled ? 'live' : 'mock',
    },
  })
})

app.use('/api/auth', auth)
app.use('/api/catalog', catalog)
app.use('/api/orders', orders)
app.use('/api/payments', payments)
app.use('/api/esim', esim)
app.use('/api/push', push)

app.listen(config.port, () => {
  console.log(`LOTTE ROAMING BFF on http://localhost:${config.port}`)
  console.log(
    `  integrations — kakao:${kakaoEnabled ? 'live' : 'mock'} portone:${
      portoneEnabled ? 'live' : 'mock'
    } smdp:${smdpEnabled ? 'live' : 'mock'}`,
  )
})
