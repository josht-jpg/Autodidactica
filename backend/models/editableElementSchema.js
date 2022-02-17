import mongoose from 'mongoose' 

const editableElementSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    },
    type: {type: String, required: true},
    text: {type: String, required: false},
    url: {type: String, required: false},
    title: {type: String, required: false},
    caption:  {type: String, required: false},
}, {
    timestamps: true
})

export default editableElementSchema