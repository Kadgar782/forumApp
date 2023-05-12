const express = require('express')
const router = express.Router()
const controller = require('../controllers/products.controller')


router.get('/', controller.getProducts)

router.get('/:productID', controller.getProduct)

router.post('/', controller.createProduct) 

router.put('/:productID', controller.updateProduct) 

router.delete('/:productID', controller.deleteProduct)

module.exports = router
