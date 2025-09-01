import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	text: {
		type: String,
		required: true
	},
	
   receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    read: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});



export default mongoose.model('Chat', messageSchema);
