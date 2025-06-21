import express from 'express'
import contactRoutes from './routes/contact.route.js'

const app = express()
app.use(express.json())

app.use('/api', contactRoutes)


export default app