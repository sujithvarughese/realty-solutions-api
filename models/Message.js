import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
	account: {
		type: mongoose.Types.ObjectId,
		ref: "Account"
	},
	sender :{
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	recipient: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	subject: {
		type: String
	},
	body: {
		type: String
	},
	read: {
		type: Boolean,
		default: false
	},
	flag: {
		type: Boolean,
		default: false
	},
	previousMessage: {
		type: mongoose.Types.ObjectId,
		ref: 'Message'
	},
	headNode: {
		type: Boolean,
		default: true
	},
	date: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	createdAt: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	}
}, {timestamps: true})

export default mongoose.model('Message', MessageSchema)