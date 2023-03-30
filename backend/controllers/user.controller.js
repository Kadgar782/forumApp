const User = require('../models/user.model.js')
const Role = require('../models/role.model.js')
const bcrypt = require('bcryptjs');
const userService = require("../service/user-service")
const {validationResult, cookie} = require("express-validator")
const tokenService = require("../service/token-service")
const salt = bcrypt.genSaltSync(7);


class authController {  
 
    async registration (req, res) {
       try{
           const errors = validationResult(req)
           if (!errors.isEmpty()){
            return res.status(400).json({message:"Error during registration",errors})
           }

           const {username, password} = req.body
           const candidate = await User.findOne({username})
           if (candidate) {
            return res.status(400).json({message:"User with this name already exists"})
           }

           const hashPassword = bcrypt.hashSync(password, salt);
           const userRole = await Role.findOne({value: "USER"})

           const user = new User ({username, password: hashPassword, roles: [userRole.value]})
           await  user.save()
           return res.json({message:"User has been successfully registered"})

       } catch (e) {
          console.log(e)
          res.status(400).json( {message:"Registration error"})
       }

    }

    async login(req, res) {
       try{
           const{username,password} = req.body
           const user = await User.findOne({username})
           if(!user){
               return res.status(400).json({message:`User ${username} not found`})
           }
           const validPassword = bcrypt.compareSync(password, user.password)
           if(!validPassword) {
            return res.status(400).json({message:"Invalid password "})
           }

          const token = tokenService.generateTokens(user._id, user.roles)
          await tokenService.saveToken(user._id, token.refreshToken)
          console.log(token.refreshToken)
          res.cookie("refreshToken", token.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: "/",
          });
          return res.json({token})
       } catch (e) {
         console.log(e)
         res.status(400).json( {message:'Login error'})
       }
    }

    async logout(req, res, next) {
      try {
          const {refreshToken} = req.cookies;
          const token = await userService.logout(refreshToken);
          res.clearCookie('refreshToken');
          return res.json(token);
      } catch (e) {
          next(e);
      }
  }

    async getUsers (req, res) {
       try{
         console.log(req.user.roles) 
          const users = await User.find() 
        res.json(users)
       } catch (e) {

       }

    }

    async refresh(req, res, next) {
      try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          path: "/",
        });
        return res.json(userData);
    } catch (e) {
        next(e);
    }
  }

    getUserRole(req, res) {
      try{
         User.findOne({ _id: req.params.userID })
         .then(result => res.status(200).json({ result }))   
      } catch (e) {
         console.log(e)
         res.status(404).json({msg: 'User not found'})
      }
    }
}

module.exports = new authController()