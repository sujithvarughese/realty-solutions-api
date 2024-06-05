import express from "express";
const router = express.Router()
import { getUnits, getMyUnit, createUnit, updateUnit, deleteUnit } from "../controllers/unit-controller.js";
import { authorizePermissions } from "../middleware/authentication.js";


router.route("/myUnit").get(getMyUnit)
router.route("/")
      .get(authorizePermissions, getUnits)
      .post(authorizePermissions, createUnit)
      .patch(authorizePermissions, updateUnit)
      .delete(authorizePermissions, deleteUnit)


export default router