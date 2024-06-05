import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { InternalServerError, UnauthenticatedError } from "../errors/index.js";

const UserSchema = new mongoose.Schema({
	account: {
		type: mongoose.Types.ObjectId,
		ref: "Account"
	},
	email: {
		type: String,
		required: [true, "please provide email"],
		validate: {
			validator: validator.isEmail,
			message: (props) => `${props.value} is not a valid email. Please provide valid email`
		},
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: [true, "please provide password"],
		minLength: 6,
		maxLength: 25,
		select: false // hidden unless explicitly called
	},
	lastName: {
		type: String,
		required: [true, "please provide name"],
		minLength: 2,
		maxLength: 40,
		trim: true
	},
	firstName: {
		type: String,
		maxLength: 40,
		trim: true
	},
	unit: {
		type: mongoose.Types.ObjectId,
		ref: "Unit"
	},
	phone: {
		type: String,
		trim: true,
		maxlength: 20,
	},
	rent: {
		type: Number,
	},
	balance: {
		type: Number,
	},
	role: {
		type: String,
		enum: ["user", "account-admin", "system-admin"],
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isSystemAdmin: {
		type: Boolean,
		default: false
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
}, { timestamps: true });

// function to hash user entered password on new user creation before we save
// will be invoked on user everytime save() is called on this
UserSchema.pre("save", async function () {
	// if password was not modified, we can return from this function without
	// ...inadvertently hashing password again
	if (!this.isModified("password")) return;
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		throw new InternalServerError("password hash failed");
	}
});

UserSchema.methods.updatePassword = async function (){
	try {
		const salt = await bcrypt.genSalt(10);
		console.log(this.password)
		this.password = await bcrypt.hash(this.password, salt);
		console.log(this.password)
		this.save()
		return true
	} catch (error) {
		throw new InternalServerError("password hash failed");
	}
}

// function on user to compare entered password to user.password
UserSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		if (await bcrypt.compare(candidatePassword, this.password)) {
			return true;
		}
	} catch {
		throw new UnauthenticatedError("invalid password");
	}
};

export default mongoose.model("User", UserSchema);