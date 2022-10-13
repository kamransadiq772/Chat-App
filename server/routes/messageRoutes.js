const express = require('express')
const { sendMesage, allMessages } = require('../controllers/messageControllers')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.route("/").post(protect,sendMesage)
router.route("/:chatId").get(protect,allMessages)

module.exports = router