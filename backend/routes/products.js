const express = require('express')
const router = express.Router()
const controller = require('../controllers/products.controller')
const authMiddleware = require("../middleware/authMiddleware")


router.get('/', controller.getProducts)

router.get('/:productID', controller.getProduct)

router.post('/', authMiddleware, controller.createProduct)

router.put('/:productID', authMiddleware, controller.updateProduct)

router.delete('/:productID', authMiddleware, controller.deleteProduct)

module.exports = router
