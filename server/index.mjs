import express from 'express'
import cors from 'cors'
import { router } from './router/index.mjs'

const PORT = 4020

// для виртуальной машины
// const PORT = 4001
const app = express()
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use('/api/v1', router)

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
