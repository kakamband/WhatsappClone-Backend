// importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import Pusher from 'pusher'

// app config
const app = express()
const port = process.env.PORT || 9000

// middleware
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// db config
const connection_url = 'mongodb+srv://admin:26OfqxKFtCuHdOhV@cluster0.6wq83.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const pusher = new Pusher({
  appId: '1077857',
  key: 'e76e7de0ddd04cbe5988',
  secret: 'f475268c955f65bbb448',
  cluster: 'us2',
  encrypted: true
});

const db = mongoose.connection

db.once('open', () => {
  console.log('DB is connected')

  const msgCollection = db.collection('messagecontents')
  const changeStream = msgCollection.watch()

  changeStream.on('change', (change) => {
    console.log(change)

    if(change.operationType === 'insert') {
      const messageDetails = change.fullDocument
      pusher.trigger('messages', 'inserted',
        {
          name: messageDetails.name,
          message: messageDetails.message
        }
      )
    }
    else {
      console.log('Error triggering Pusher')
    }
  })
})
// ???

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'))

app.get('/api/v1/messages/sync', (req, res) => {
  Messages.find((err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(200).send(data)
    }
  })
})

app.post('/api/v1/messages/new', (req, res) => {
  const dbMessage = req.body

  Messages.create(dbMessage, (err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(data)
    }
  })
})

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`))