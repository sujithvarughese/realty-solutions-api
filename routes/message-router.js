import express from "express";
const router = express.Router()
import {
    createMessage,
    getMessages,
    getMessage,
    markMessageRead,
    markMessageUnread,
    toggleFlag,
    deleteMessage,
    getPreviousMessages
} from "../controllers/message-controller.js";

router.route("/read").patch(markMessageRead)
router.route("/unread").patch(markMessageUnread)
router.route("/flag").patch(toggleFlag)
router.route("/previous/:message").get(getPreviousMessages)
router.route("/:message").get(getMessage)
router.route("/").get(getMessages).post(createMessage).delete(deleteMessage)
export default router