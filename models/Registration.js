import mongoose from 'mongoose'
import validator from "validator";
import bcrypt from "bcryptjs";
import { InternalServerError, UnauthenticatedError } from "../errors/index.js";

const RegistrationSchema = new mongoose.Schema({
    account : {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: (props) => `${props.value} is not a valid email. Please provide valid email`
        },
        unique: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: [true, "please provide name"],
        minLength: 2,
        maxLength: 40,
        trim: true,
    },
    firstName: {
        type: String,
        maxLength: 40,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 20,
    },
    unit: {
        type: mongoose.Types.ObjectId,
        ref: 'Unit',
    },
    rent: {
        type: Number,
    },
    balance: {
        type: Number,
    },
    code: {
        type: String,
        select: false // hidden unless explicitly called
    },
    role: {
        type: String,
        enum: ["account-admin", "user"]
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

RegistrationSchema.pre("save", async function () {
    // if code was not modified, we can return from this function without
    // ...inadvertently hashing code again
    if (!this.isModified("code")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.code = await bcrypt.hash(this.code, salt);
    } catch (error) {
        throw new InternalServerError("code hash failed");
    }
});
// function on user to compare entered code to registration.code
RegistrationSchema.methods.compareRegistrationCode = async function (candidateCode) {
    try {
        if (await bcrypt.compare(candidateCode, this.code)) {
            return true;
        }
    } catch {
        throw new UnauthenticatedError("invalid registration code");
    }
};


export default mongoose.model('Registration', RegistrationSchema)