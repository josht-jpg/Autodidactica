import mongoose from 'mongoose'
import exerciseSchema from './exerciseSchema.js'

const Exercise = mongoose.model('Exercise', exerciseSchema)

export default Exercise