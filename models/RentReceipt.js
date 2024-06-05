import mongoose from 'mongoose'
import validator from "validator";

const RentReceiptSchema = new mongoose.Schema({
	account: {
		type: mongoose.Types.ObjectId,
		ref: "Account"
	},
	user : {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: String,
	},
	amountPaid: {
		type: Number
	},
	balance: {
		type: Number
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

export default mongoose.model('RentReceipt', RentReceiptSchema)