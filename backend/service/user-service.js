const User = require('../models/user.model.js')
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');


class UserService {


  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
}


async refresh(refreshToken ) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
  }
      const userData = tokenService.validateRefreshToken(refreshToken);// id and roles
      const tokenFromDb = await tokenService.findToken(refreshToken);//  _id, user ObjectId and refreshToken

      if (!userData || !tokenFromDb) {
      // Sometimes token from db is null and there is a logout at the front, but I have not found the reason for this, it happens at absolutely random moments, 
      // it can successfully give the user and refreshtoken to it 5-10 times, but when I start the server it can give null after two times

      // this bug disappeared by itself during development, but just in case I'll leave it
        console.log(userData, "this is user data for the moment before the error")
        console.log(tokenFromDb, "this is a refresh token and user at the moment before the error")
        throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);

    const tokens = tokenService.generateTokens(user._id, user.roles);

    await tokenService.saveToken(user.id, tokens.refreshToken);

     return {...tokens, user};
}

  async activate(activationLink) {
    const user = await User.findOne({activationLink})
    if (!user) {
        throw ApiError.BadRequest('Invalid activation link')
    }
    user.isActivated = true;
    await user.save();
}

}


module.exports = new UserService()