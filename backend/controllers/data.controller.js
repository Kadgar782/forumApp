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
        if (req.headers.authorization === "Bearer" || req.headers.authorization === "Bearer null" ) {
          //without roles
          if (!arrayForComments) {
            const commentsInPost = [];
            return {
              ...p,
              commentsInPost,
              controls,
            };
          } else {
            const commentsInPost = arrayForComments;
            return {
              ...p,
              commentsInPost,
              controls,
            };
          }
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
                controls,
              };
            }
            return {
              ...p,
              commentsInPost,
              controls,
            };
          } else {
            const commentsInPost = arrayForComments;
            if (adminRole === "ADMIN") {
              const controls = true;
              return {
                ...p,
                commentsInPost,
                controls,
              };
            }
            return {
              ...p,
              commentsInPost,
              controls,
            };
          }
        }
      }); // whole function

      res.status(200).json({ data });
    } catch (error) {
      res.status(404).json({ msg: error });
    }
  };
}

module.exports = new dataController();
