import Unit from "../models/Unit.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Finance from "../models/Finance.js";

// user
const getMyUnit = async (req, res) => {
	// find unit details based on data stored in req.user from login
	const myUnit = await Unit.findOne({ user: req.user.userID })
	res.status(StatusCodes.OK)
		.json({
			msg: "Unit successfully retrieved",
			myUnit: myUnit
		})
}
// admin only
const getUnits = async (req, res) => {
	const units = await Unit.find()
	res.status(StatusCodes.OK)
		.json({
			msg: "Units successfully retrieved",
			units: units
		})
}

const createUnit = async (req, res) => {
	// { ...unit } = req.body
	// check if unit already exists
	const duplicate = await Unit.findOne({
		houseNumber: req.body.houseNumber,
		address: req.body.address,
		apartmentNumber: req.body.apartmentNumber
	})
	if (duplicate) {
		throw new BadRequestError("MyUnit already exists!")
	}

	// create new unit
	const newUnit = await Unit.create(req.body)

	// create empty Finance object for unit
	const newFinancialData = {
		unit: newUnit,
		purchasePrice: "",
		rent: "",
		fairMarketRent: "",
		annualPropertyTax: "",
		mortgage: {
			bank: "",
			principal: "",
			interest: "",
			term: "",
			paymentsMade: ""
		},
		insurance: {
			company: "",
			agent: "",
			phone: "",
			email: "",
			annualPremium: "",
			coverage: ""
		},
		hoa: {
			company: "",
			agent: "",
			phone: "",
			email: "",
			annualFee: ""
		}
	}
	// create mongoose model
	const newFinance = await Finance.create(newFinancialData)
	// update unit model with Finance
	const unit = await Unit.findByIdAndUpdate(newUnit, { finances: newFinance })
	// send response JSON to include new unit
	res.status(StatusCodes.CREATED).json({
		msg: "success",
		unit: unit
	})
}

const updateUnit = async (req, res) => {
	const unit = await Unit.findByIdAndUpdate(req.body._id, req.body )
	if (!unit) {
		throw new NotFoundError(`No unit with id :${req.body._id}`);
	}
	res.status(StatusCodes.OK).json({ msg: 'unit update success' })
}

const deleteUnit = async (req, res) => {
	const unit = await Unit.findByIdAndDelete(req.body._id)
	if (!unit) {
		throw new NotFoundError(`No unit with id :${_id}`);
	}
	res.status(StatusCodes.OK).json({ msg: 'success' })
}

export { getUnits, getMyUnit, createUnit, updateUnit, deleteUnit }