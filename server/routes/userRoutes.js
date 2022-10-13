const express = require('express')

const router = express.Router()
const {registerUser, authUser,allUsers} = require('../controllers/userController')
const {protect} = require('../middlewares/authMiddleware')


// router.get('/') //for simple 

//For chaining multiple requests
// router.route('/users').get(()=>{}).post(()=>{}).put(()=>{}).delete(()=>{})


router.route('/').post(registerUser).get(protect,allUsers)  //one way (multiple routes could be chained)
router.post('/login',authUser)         // other way(without chaining)


module.exports = router