import mongoose from 'mongoose'

const whatsappShcema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String
})

export default mongoose.model('messageContent', whatsappShcema)