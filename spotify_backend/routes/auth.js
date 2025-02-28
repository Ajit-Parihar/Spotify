// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const {getToken}=require("../utils/helpers");
// // router.use(express.json()); 
// //This post route help to register a user
// router.post("/register",async (req,res)=>{
//      //fetch data from req.body;

//      const {email,password,firstName,lastName,username}=req.body;

//      console.log("hello");

//      //setp 2. does a use with exist same email id

//      const user = await User.findOne({email: email});
//      if(user){
//         return res.status(403)
//         .json({error: "A user with this email already exists"})
//      }

//      //setp 3. Create a new user in the DB
//     //setp 3.1 : we do not store password in plain text.
//     //xyz: we convert the plain text password to a hash.
//      const hashedPassword = bcrypt.hash(password,10);
//      const newUserData ={email,password: hashedPassword,firstName,lastName,username};
//      const newUser = await User.create(newUserData);

//      //setp 4. we want to create the token to return to the user
//      const token = await getToken(email,newUser);

//      //setp 5: Return the result to the user
//      const userToReturn = {...newUser.toJSON(),token};
//      delete userToReturn.password;
//      return res.status(200).json(userToReturn);
// });

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers");

// This POST route will help to register a user
router.post("/register", async (req, res) => {
    // This code is run when the /register api is called as a POST request

    // My req.body will be of the format {email, password, firstName, lastName, username }
    const {email, password, firstName, lastName, username} = req.body;

    // Step 2 : Does a user with this email already exist? If yes, we throw an error.
    const user = await User.findOne({email: email});
    if (user) {
        // status code by default is 200
        return res
            .status(403)
            .json({error: "A user with this email already exists"});
    }
    // This is a valid request

    // Step 3: Create a new user in the DB
    // Step 3.1 : We do not store passwords in plain text.
    // xyz: we convert the plain text password to a hash.
    // xyz --> asghajskbvjacnijhabigbr
    // My hash of xyz depends on 2 parameters.
    // If I keep those 2 parameters same, xyz ALWAYS gives the same hash.
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
    };
    const newUser = await User.create(newUserData);
    // Step 4: We want to create the token to return to the user
    const token = await getToken(email, newUser);

    // Step 5: Return the result to the user
    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req,res)=>{
   //setp 1: Get email and password send by user for req.body
   let {email, password} = req.body;
   //setp 2: check if a use with the give email exist. if not, the user not exist
   const user = await User.findOne({email: email});
   if(!user){
       return res.status(403).json({err: "Invalid credentials"});
   }
   //setp 3: if the user exists, check if the password is correct. If not
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if(!isPasswordValid){
        return res.status(403).json({err:"invalid credentials"});
   }
   //setp 4: if login user are correct the return a token
   const token = await getToken(user.email, user);
   const userToReturn = {...user.toJSON(),token};
   delete userToReturn.password;
   return res.status(200).json(userToReturn);
});

module.exports=router; 