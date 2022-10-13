const mongoose = require('mongoose')
const dotenv = require('dotenv').config()


const connectdb = async() =>{
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
      })
      console.log("connected to host : "+conn.connection.host)
    }catch(e){
      console.log("Error is : "+e.message)
      process.exit()    
    }
}

module.exports = connectdb