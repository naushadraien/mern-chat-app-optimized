import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    content: String,
    attachments: [
        {
            public_id: {
                type: String,
                required: [true, 'Public id is required'],
            },
            url: {
                type: String,
                required: [true, 'Attachment url is required'],
            },
        },
    ],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender id is required'],
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, 'Chat id is required'],
    },
}, { timestamps: true });
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
