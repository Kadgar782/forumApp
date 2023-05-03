const express = require('express')
const router = express.Router()
const controller = require('../controllers/comment.controller')


router.get('/', controller.getComments)

router.get('/:commentID', controller.getComment)

router.get('/post/:postId', controller.getCommentsForPost)

router.post('/', controller.createComment) 

router.put('/:commentID', controller.updateComment) 

router.delete('/:commentID', controller.deleteComment)

router.delete('/post/:postId', controller.deleteCommentsFromPost)

module.exports = router
