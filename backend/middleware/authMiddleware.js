const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {


  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodeData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      //we save the decrypted data in req.user and pass to the next route handler
      req.user = decodeData;
    }
  } catch (e) {
    console.log(e);
  }
  //but if there is no token, then in the next handker we will have to check the req.user and return the status 401 Unauthorized
  next();
}; 