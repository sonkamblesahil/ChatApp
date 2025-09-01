import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            messageType: { 
                type: String, 
                enum: ['text', 'emoji'], 
                default: 'text' 
            },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Message', conversationSchema);