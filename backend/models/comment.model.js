const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    username: String,
    postId: String,
    body:String,
   })

const Comment = mongoose.model('Comment', ProductSchema)



module.exports = Comment