const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
    {
        name:{type:String, require:true},
        email:{type:String, require:true, unique:true},
        password:{type:String, require:true},
        pic:{type:String},
    },{
        timestamps : true
    }
)

userSchema.methods.matchpassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


const User = mongoose.model("User",userSchema)
module.exports = User