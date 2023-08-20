const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodeData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      //we save the decrypted data in req.user and pass to the next route handler
      req.user = decodeData;
      // According to the ID in the model, you can also find the user himself here and whether his account is activated, if not activated, return the 403 status.
      // On the frontend, when trying to write a post or comment, display in the notification that he needs to activate his account via email
      const currentUser = await User.findById(decodeData.id);
      if (!currentUser.isActivated) {
        return res.status(403).json({ meesage: "Account is not activated" });
      }
    }
  } catch (err) {
    return res.status(401).json({ msg: "Jwt expired" });
  }
  //but if there is no token, then in the next handler we will have to check the req.user and return the status 401 Unauthorized
  next();
};
