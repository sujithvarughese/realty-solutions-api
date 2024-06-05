import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";
import Account from "../models/Account.js";
import User from "../models/User.js";
import crypto from "crypto";
import Registration from "../models/Registration.js";

// function for system admin only to create new accounts(account has its own admin and users)
// when creating account, account admin should also be set up
const createAccount = async (req, res) => {
    const account = await Account.create({ admin: null })
    res.status(StatusCodes.CREATED).json({
        message: "Account created",
        account: account
    });
}

const createAccountAdminRegistration = async (req, res) => {
    // { account, email, lastName, firstName } = req.body
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
        account: req.body.account,
        email: req.body.email,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        code: randomCode,
        isAdmin: true,
        role: "account-admin"
    }

    const newRegistration = await Registration.create(registration)

    res.status(StatusCodes.CREATED).json({
        message: "Registration Code created. Please give code to account admin to complete registration",
        registration: newRegistration
    });
}

const createSystemAdmin = async (req, res) => {
    // { lastName: "Administrator", firstName: "System", email, phone, password }
    const systemAdmin = await User.create({ ...req.body, isAdmin: true, role: "system-admin" })
    res.status(StatusCodes.CREATED).json({
        message: "System Admin Created",
        systemAdmin: systemAdmin
    })
}

const getAccounts = async (req,res) => {
    const accounts = await Account.find().populate("admin")
    res.status(StatusCodes.CREATED).json({
        message: "Accounts successfully retrieved",
        accounts: accounts
    })
}

export { createAccount, createSystemAdmin, createAccountAdminRegistration, getAccounts }