import express, { json } from 'express'
import router from './routes.mjs'
import cors from 'cors'
import { initialize } from './tabels.mjs'

const application = express()
application.use(cors())
application.use(json())
application.use('/api', router)

const PORT = 8080
application.listen(PORT, async () => {
  try {
    console.log(`\tWelcome! I m listening on ${PORT}`)
    await initialize()
    console.log('\tDatabase is initialized')
  } catch (e) {
    console.error(error)
  }
})
