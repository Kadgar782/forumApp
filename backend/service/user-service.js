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
        throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);

    const tokens = tokenService.generateTokens(user._id, user.roles);

    await tokenService.saveToken(user.id, tokens.refreshToken);

     return {...tokens, user};
}
}


module.exports = new UserService()