const asyncHandler = require('express-async-handler')  //for auto handling errors
const generateToken = require('../config/generateJsonwebtoken')
const User = require("../models/userModel")


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body   //destructuring the req.body 

  if (!email || !name || !password) {
    res.status(400);
    throw new Error("Please Entre All Fields")
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User Email Already Exists")
  }

  const user = await User.create({
    name, email, password, pic
  }) //in return it will give the created user

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Failed to Create User")
  }

})


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchpassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Invalid Credential")
  }

})

// api/user?search=piyush
const allUsers = asyncHandler(async (req, res) => {
  // const keyword = req.query
  // console.log(keyword)

  const keyword = req.query.search ? {
    $or: [  //$or is for OR in both given entities 
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ]
  } : {}

  const users = await User.find(keyword).find({_id:{$ne:req.user._id}}) //$ne is for not equal to
  res.send(users)

})

module.exports = { registerUser, authUser, allUsers }

