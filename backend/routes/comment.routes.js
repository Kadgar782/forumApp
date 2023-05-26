const express = require('express')
const router = express.Router()
const controller = require('../controllers/comment.controller')
const authMiddleware = require("../middleware/authMiddleware")


router.get('/', controller.getComments)

router.get('/:commentID', controller.getComment)

router.get('/post/:postId', controller.getCommentsForPost)

router.post('/', authMiddleware, controller.createComment) 

router.put('/:commentID', authMiddleware, controller.updateComment) 

router.delete('/:commentID', authMiddleware, controller.deleteComment)

router.delete('/post/:postId', authMiddleware, controller.deleteCommentsFromPost)

module.exports = router
