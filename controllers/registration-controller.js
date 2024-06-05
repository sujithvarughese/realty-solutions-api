import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import Unit from "../models/Unit.js";
import { attachCookies, createJWT } from "../utils/index.js";

// account admin function to create user eligible to register
const createRegistration = async (req, res) => {
    console.log(req.user)
    // { email, lastName, firstName } = req.body
    // if any fields missing from user front end, throw error
    if (!req.body.lastName || !req.body.firstName || !req.body.email) {
        throw new BadRequestError("Please provide all values");
    }
    // validate that user not already in database
    const userAlreadyExists = await User.findOne({ email: req.body.email });
    if (userAlreadyExists) {
        throw new BadRequestError("User already exists");
    }
    const randomCode = crypto.randomBytes(8).toString("hex")

    const registration = {
        account: req.user.account,
        unit: req.body.unit,
        email: req.body.email,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        rent: req.body.rent,
        balance: req.body.balance,
        code: randomCode,
        isAdmin: false,
        role: "user"
    }

    const newRegistration = await Registration.create(registration)

    res.status(StatusCodes.CREATED).json({
        message: "success",
        registration: newRegistration
    });
}

const verifyRegistration = async (req, res) => {
    // { email, registrationCode, password } = req.body
    // retrieve registration data with registration code
    const registration = await Registration.findOne({ email: req.body.email }).select("+code");
    if (!registration) {
        throw new UnauthenticatedError("Email not found. Check credentials or contact an administrator");
    }

    // code must match created code when registration was created (admin must give code to user)
    const registrationCodeVerified = registration.code === req.body.registrationCode
    if (!registrationCodeVerified) {
        throw new UnauthenticatedError("Invalid registration code");
    }

    // convert model document to plain js object to delete registration._id property that is no longer needed
    const newUser = registration.toObject()
    delete newUser._id

    // create new User instance (password will automatically get hashed and saved using pre middleware)
    const user = await User.create({ ...newUser, password: req.body.password })

    // user variable with just the fields we want to send to attach (will also be saved in front end state so do not
    // send confidential user data)
    const userInfo = {
        userID: user._id,
        isAdmin: user.isAdmin,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    };

    // tenant object created to store in unit instance
    if (newUser.role === "user") {
        const tenant = {
            lastName: registration.lastName,
            firstName: registration.firstName,
            email: registration.email,
            phone: registration.phone,
            rent: registration.rent,
        }
        await Unit.findByIdAndUpdate(registration.unit, { user: user, tenant: tenant })
    }

    // create jwt with jwt.sign
    const token = createJWT({ payload: userInfo })

    // create cookie in the response, where we attach token
    attachCookies({ res, token })


    // delete instance because it is not needed since user is created
    await Registration.findByIdAndDelete(registration._id)

    res.status(StatusCodes.OK).json({
        message: "Registration Verified",
        user: userInfo
    });

}
export { createRegistration, verifyRegistration }