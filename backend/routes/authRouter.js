const Router = require('express')
const router = new Router()
const controller = require('../controllers/user.controller')
const {check} = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")

router.post('/registration', [
    check('username', "Username can't be empty").notEmpty(),
    check('email', "Email can't be empty").notEmpty(),
    check('password', "Password must be more than 6 characters and less than 20").isLength({min:6, max:20})
], controller.registration)
router.post('/login', controller.login)
router.post('/logout', controller.logout);
router.get('/users', authMiddleware, controller.getUsers)
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);
router.get('/:userID', controller.getUserRole)

module.exports = router