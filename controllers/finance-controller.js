import RentReceipt from "../models/RentReceipt.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/index.js";
import Finance from "../models/Finance.js";

const getRentReceipts = async (req, res) => {
	// const { unit, year } = req.params
	if (!req.user.isAdmin) {
		if (req.user.userID !== req.params.id) {
			throw new UnauthenticatedError("Error validating user");
		}
	}
	const rentReceipts = await RentReceipt.find({ user: req.params.user, date: { $regex: req.params.date } })
	res.status(StatusCodes.OK)
		.json({
			msg: "Rent Receipts Successfully retrieved",
			rentReceipts: rentReceipts
		})
}

const createRentReceipt = async (req, res) => {
	// {user, date, amountPaid, balance} = req.body
	const rentReceipt = await RentReceipt.create(req.body)
	res.status(StatusCodes.CREATED)
		.json({
			msg: "success",
			rentReceipt: rentReceipt
		});
}

const createUnitFinances = async (req, res) => {
	// { ...finance } = req.body
	const unitFinance = await Finance.create(req.body)
	res.status(StatusCodes.CREATED)
		.json({
			msg: "Unit Finance successfully created",
			unitFinance: unitFinance
		});
}

const updateUnitFinances = async (req, res) => {
	// { id, values: {...finance property} } = req.body
	await Finance.findByIdAndUpdate(req.body.id, req.body.values)
	console.log(req.body.values)
	res.status(StatusCodes.OK)
		.json({
			msg: "Unit Finance successfully updated",
			financeField: req.body
		})
}

const getUnitFinances = async (req, res) => {
	// const { unit } = req.params
	const unitFinance = await Finance.findOne({ unit: req.params.unit })
	res.status(StatusCodes.OK)
		.json({
			msg: "Unit Finance successfully retrieved",
			unitFinance: unitFinance
		});
}

const getFinancialSummary = async (req, res) => {
	const finances = await Finance.find()
	res.status(StatusCodes.OK)
		.json({
			msg: "Financial overview successfully retrieved",
			finances: finances
		});
}

export { getRentReceipts, createRentReceipt, createUnitFinances, updateUnitFinances, getUnitFinances, getFinancialSummary }