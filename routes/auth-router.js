import express from "express"
const router = express.Router();
import { login, logout, getUserList, getAdminInfo } from "../controllers/auth-controller.js";
import {authorizePermissions} from "../middleware/authentication.js";

router.route("/login").post(login)
router.route('/logout').get(logout)
router.route("/getUserList").get(getUserList)
router.route("/getAdminInfo").get(getAdminInfo)



export default router

