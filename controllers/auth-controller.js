import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import Unit from "../models/Unit.js";
import { attachCookies, createJWT } from "../utils/index.js";

const login = async (req, res) => {
	console.log(req.body)
	// if any fields missing from user front end, throw error
	if (!req.body.email || !req.body.password) {
		throw new BadRequestError("please provide email and password");
	}

	// check UserHome model in database for entered email
	// select('+password') needed since password property in UserHome is hidden
	const user = await User.findOne({ email: req.body.email }).select("+password");
	if (!user) {
		throw new UnauthenticatedError("Invalid credentials");
	}

	// verify entered password using function we created in UserHome.js
	// to compare with this.password
	const passwordVerified = await user.comparePassword(req.body.password);
	if (!passwordVerified) {
		throw new UnauthenticatedError("Invalid credentials");
	}
	// user variable with just the fields we want to send to attach (will also be saved in front end state)
	const userInfo = {
		userID: user._id,
		account: user.account,
		isAdmin: user.isAdmin,
		role: user.role,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		rent: user.rent,
		balance: user.balance,
		isSystemAdmin: user.isSystemAdmin
	};

	// create jwt with jwt.sign
	const token = createJWT({ payload: userInfo });

	// create cookie in the response, where we attach token
	attachCookies({ res, token });
	res.status(StatusCodes.OK).json({
		message: "user logged in success",
		user: userInfo,
	});
}

const logout = async (req, res) => {
	// change token name to anything, then expire it
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now())
	});

	res.status(StatusCodes.OK).json({ message: "user logged out" });
}

const getUserList = async (req, res) => {
	const users = await User.find({ isAdmin: false }).sort({ lastName: -1})
	// format to display front end
	const userList = users.map(user => {
		return {
			text: `${user.lastName}, ${user.firstName}`,
			value: user.id
		}

	})
	res.status(StatusCodes.OK).json({ userList })
}

const getAdminInfo = async (req, res) => {
	const admin = await User.findOne({ isAdmin: true })
	const adminInfo = [{
		text: "Admin",
		value: admin.id
	}]
	res.status(StatusCodes.OK).json({ adminInfo })
}

const updateUser = async (req, res) => {
	const user = await User.findByIdAndUpdate(req.body._id, req.body)
	if (!user) {
		throw new NotFoundError(`No user with id :${req.body._id}`);
	}
	res.status(StatusCodes.OK).json({ msg: 'Update success' })
}

export { login, logout, getUserList, getAdminInfo, updateUser }