import mongoose from 'mongoose'
import validator from "validator";
import bcrypt from "bcryptjs";
import { InternalServerError, UnauthenticatedError } from "../errors/index.js";

const AccountSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
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

export default mongoose.model('Account', AccountSchema)