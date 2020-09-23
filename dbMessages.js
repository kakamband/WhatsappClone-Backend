import mongoose from 'mongoose'

const whatsappShcema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean
})

export default mongoose.model('messagecontents', whatsappShcema)