import mongoose from 'mongoose'
import notepadSchema from './notePadSchema.js'

const Notepad = mongoose.model('Notepad', notepadSchema)

export default Notepad