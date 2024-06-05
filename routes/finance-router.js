import express from "express"
const router = express.Router();
import { authorizePermissions } from "../middleware/authentication.js";


import {
    getRentReceipts,
    createRentReceipt,
    createUnitFinances,
    getUnitFinances,
    getFinancialSummary,
    updateUnitFinances
} from "../controllers/finance-controller.js";

router.route("/rent/:user/:date").get(getRentReceipts)
router.route("/rent").post(authorizePermissions, createRentReceipt)
router.route("/:unit").get(authorizePermissions, getUnitFinances)
router.route("/")
    .get(authorizePermissions, getFinancialSummary)
    .post(authorizePermissions, createUnitFinances)
    .patch(authorizePermissions, updateUnitFinances)



export default router

