const Comment = require("../models/comment.model.js");
const Product = require("../models/product.model.js");

class dataController {
  getData = async (req, res) => {
    try {
      const [posts, comments] = await Promise.all([
        Product.find({}).lean(),
        Comment.find({}).lean(),
      ]);

      const data = posts.map((p) => {
        //Add Comments
        const arrayForComments = comments.filter(
          (u) => u.postId === p._id.toString()
        );
        const controls = false;
        const hasComments = arrayForComments.length > 0;
        if (req.headers.authorization === "Bearer" || req.headers.authorization === "Bearer null" ) {
          //without roles and comments 
          if (!arrayForComments) {
            const commentsInPost = [];
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          } else {// has some comments 
            const commentsInPost = arrayForComments;
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          }//this is where the options for an unauthorized user end
        } else {
          //have roles
          const adminRole = req.user.roles.find((role) => role === "ADMIN");
          if (!arrayForComments) {
            const commentsInPost = [];
            if (adminRole) {
              const controls = true;
              // If the user is an admin, we return the posts with editing enabled
              return {
                ...p,
                commentsInPost,
                hasComments,
                controls,
              };
            }
            //else user is not admin and controls = false
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          } else { // with comments 
            const commentsInPost = arrayForComments;
            // without next if admin can't edit others posts
            if (adminRole === "ADMIN") {
              const controls = true;
              return {
                ...p,
                commentsInPost,
                hasComments,
                controls,
              };
            }
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          }
        }
      }); 

      res.status(200).json({ data });
    } catch (error) {
      res.status(404).json({  error });
    }
  };
}

module.exports = new dataController();
