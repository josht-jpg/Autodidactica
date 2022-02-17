import mongoose from 'mongoose'
import goalSchema from './goalSchema.js'

const Goals = mongoose.model('Goals', goalSchema)

export default Goals