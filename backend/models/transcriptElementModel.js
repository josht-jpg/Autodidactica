import mongoose from 'mongoose'
import transcriptElementSchema from './transcriptElementSchema.js'

const TranscriptElement = mongoose.model('transcriptElement', transcriptElementSchema)

export default TranscriptElement