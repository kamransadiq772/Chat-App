const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const connectdb = require('./config/db')
const port = process.env.PORT
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const {notfound,errorHandler} = require('./middlewares/errorMiddlewares')

connectdb()

app.use(express.json())  //to accept json data

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.get('/', (req, res) => {
    res.send({'kamran':'1','ali':'2'})
})

app.use(notfound)
app.use(errorHandler)


const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connection", (socket)=>{
    console.log("Conneted to io")
    socket.on('setup',(userData)=>{
      socket.join(userData._id)
      console.log(userData._id)
      socket.emit("connected")
    })

    socket.on("join chat", (room)=>{
        socket.join(room)
        console.log("User Join Room : "+room)
    })

    socket.on('typing',(room)=>{
       socket.in(room).emit("typing")
    })

    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing")
     })

    socket.on('new message',(newMessageRecieved)=>{
       var chat = newMessageRecieved.chat
       if(!chat.users){
        return console.log("chats.users are not defined")
       }
       chat.users.forEach(user=>{
        if(user._id == newMessageRecieved.sender._id) return
        socket.in(user._id).emit("message recieved", newMessageRecieved)
       })
    })

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })

})
