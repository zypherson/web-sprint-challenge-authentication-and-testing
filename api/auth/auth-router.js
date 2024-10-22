/* eslint-disable no-unused-vars */
const router = require('express').Router();
const User = require('../users/users-model')
const bycrpt = require('bcryptjs')
const {validateCredentials} = require('./validate')
const{checkUsernameFree,checkUsernameExists} = require('./auth-middleware')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../secrets')



router.post('/register',validateCredentials, checkUsernameFree,  (req, res, next) => {
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 const {username, password} = req.body
 

 if(!req.body.username || !req.body.password){
  res.status(400).json({message:'username and password required'})
 }else{
const hashedPassword = bycrpt.hashSync(password,6)
User.add({username,password:hashedPassword})
 .then(newUser =>{
  res.status(201).json(newUser)
 })
 .catch(err=>{
  res.status(500).json({message:err.message})
 })
}
});





router.post('/login',validateCredentials,checkUsernameExists, (req, res,next) => {
  const {username,password} = req.body
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

      if(bycrpt.compareSync(req.body.password, req.user.password)){
        const token = buildToken(req.user)
        res.json({
          message:`${req.user.username} is back`,
          token,
         })
      }else{
       res.status(401).json({message:'invalid credentials'})
      }
 
});

function buildToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn:'1d',
  }
  return jwt.sign(payload,JWT_SECRET,options)

}

module.exports = router;
