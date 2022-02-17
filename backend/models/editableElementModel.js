import mongoose from 'mongoose'
import editableElementSchema from './editableElementSchema.js'

const EditableElement = mongoose.model('editableElement', editableElementSchema)

export default EditableElement