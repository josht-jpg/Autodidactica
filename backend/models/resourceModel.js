import mongoose from 'mongoose'
import resourceSchema from './resourceShema.js'

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource