import mongoose from 'mongoose';
const requestSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender id is required'],
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver id is required'],
    },
}, { timestamps: true });
export const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);
