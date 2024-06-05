import express from "express";
const router = express.Router()
import { createAccount, createSystemAdmin, createAccountAdminRegistration, getAccounts } from "../controllers/account-controller.js";

router.route("/").get(getAccounts).post(createAccount)
router.route("/accountAdmin").post(createAccountAdminRegistration)
router.route("/system").post(createSystemAdmin)

export default router