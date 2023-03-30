const Router = require('express')
const router = new Router()
const controller = require('../controllers/user.controller')
const {check} = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/registration', [
    check('username', "Username can't be empty").notEmpty(),
    check('password', "Password must be more than 4 characters and less than 10").isLength({min:4, max:10})
], controller.registration)
router.post('/login', controller.login)
router.post('/logout', controller.logout);
router.get('/users', authMiddleware, controller.getUsers)
router.get('/refresh', controller.refresh);
router.get('/:userID', controller.getUserRole)

module.exports = router