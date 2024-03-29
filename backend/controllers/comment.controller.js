const Comment = require('../models/comment.model.js')

class commentController {

 getComments = ((req, res) => {
    Comment.find({})
        .then(result => res.status(200).json({ result }))
        .catch(error => res.status(404).json({msg: 'Comments not found'}))
})

 getComment = ((req, res) => {
    Comment.findOne({ _id: req.params.commentID })
        .then(result => res.status(200).json({ result }))
        .catch(() => res.status(404).json({msg: 'Comment not found'}))
})

 async getCommentsForPost (req, res) {
  const page = parseInt(req.query.page || 0);
  const limit = parseInt(req.query.limit || 3);
  const endIndex = page + limit
  try {
   const comments = await Comment.find( {postId: req.params.postId} )
   const dividedComment = comments.slice(page, page + limit);
   const hasMore = comments.length > endIndex;
   res.send({ comments: dividedComment, hasMore });
  } catch (error) {
    res.status(404).json({ msg: "Comment not found" });  
  }
 };

 createComment = ((req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
    Comment.create(req.body)
        .then(result => res.status(200).json({ result }))
        .catch((error) => res.status(500).json({msg:  error }))
})

 updateComment = ((req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
    Comment.findOneAndUpdate({ _id: req.params.commentID }, req.body, { new: true, runValidators: true })
        .then(result => res.status(200).json({ result }))
        .catch((error) => res.status(404).json({msg: 'Comment not found' }))
})

 deleteComment = ((req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
    Comment.findOneAndDelete({ _id: req.params.commentID })
        .then(result => res.status(200).json({ result }))
        .catch((error) => res.status(404).json({msg: 'Comment not found' }))
})

async deleteCommentsFromPost (req, res){
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const postId =  req.params.postId;
    const result = await Comment.deleteMany({ postId });
    res.status(200).json({ result });
  } catch (error) {
    res.status(404).json({ msg: "Comment not found" });
  }
};

}

module.exports = new commentController()