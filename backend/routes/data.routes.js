const express = require('express')
const router = express.Router()
const controller = require ('../controllers/data.controller')
const authMiddleware = require("../middleware/authMiddleware")

router.get('/', authMiddleware, controller.getData)

module.exports = router