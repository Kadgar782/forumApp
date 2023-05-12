const Comment = require("../models/comment.model.js");
const Product = require("../models/product.model.js");

class dataController {
  getData = async (req, res) => {
  //this is the number of parameters by which we determine how many posts we should pass
    const page = parseInt(req.query.page || 0);
    const limit = parseInt(req.query.limit || 3);
    const endIndex = page + limit

    try {
      const [posts, comments] = await Promise.all([
        Product.find({}).lean(),
        Comment.find({}).lean(),
      ]);
      const dividedPosts = posts.slice(page, page + limit);
      const hasMore = posts.length > endIndex;

      const data = dividedPosts.map((p) => {
        //Add Comments
        const arrayForComments = comments.filter(
          (u) => u.postId === p._id.toString()
        );
        const controls = false;
        const hasComments = arrayForComments.length > 0;
        if (
          req.headers.authorization === "Bearer" ||
          req.headers.authorization === "Bearer null"
        ) {
          //without roles and comments
          if (!arrayForComments) {
            const commentsInPost = 0;
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          } else {
            // has some comments
            const commentsInPost = arrayForComments.length;
            return {
              ...p,
              commentsInPost,
              hasComments,
              controls,
            };
          } //this is where the options for an unauthorized user end
        } else {
          //have roles
          const adminRole = req.user.roles.find((role) => role === "ADMIN");
          if (!arrayForComments) {
            const commentsInPost = 0;
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
          } else {
            // with comments
            const commentsInPost = arrayForComments.length;
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

      res.status(200).json({ data, hasMore });
    } catch (error) {
      res.status(404).json({ error });
    }
  };
}

module.exports = new dataController();
