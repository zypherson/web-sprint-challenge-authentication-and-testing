/* eslint-disable no-unused-vars */
const User = require('../users/users-model')


async function checkUsernameFree (req,res,next) {
    const {username} = req.body
   
      const users = await User.findBy(username)
      if(users){
        next({status:400, message:"username taken"})
      }else{
       next()
      }
    
      
    }

    





    module.exports = {
        checkUsernameFree
      }