import { Box, Button, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getsender, getsenderuser } from './config/ChatLogics'
import ProfileModel from './miscellaneouse/ProfileModel'
import UpdateGroupChatModal from './miscellaneouse/UpdateGroupChatModal'
import './style.css'
import { ScrollableChat } from './ScrollableChat'
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:4000"
var socket, selectedChatCompare; 

const SingleChat = ({ fetchAgain, setfetchAgain }) => {

    const { user, selectedChat, setselectedChat } = ChatState()
    const [loading, setloading] = useState(false);
    const [newMessage, setnewMessage] = useState();
    const [Messages, setMessages] = useState([]);
    const [sockedConnected, setsockedConnected] = useState(false);
    const [typing, settyping] = useState(false);
    const [istyping, setistyping] = useState(false);

    const toast = useToast()

    const fetchMessages = async() => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            setloading(true)

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setloading(false)
            socket.emit('join chat', selectedChat._id)
            // console.log(data)
        } catch (error) {
            toast({
                title: 'Failed to send message',
                status: 'warning',
                duration: '5000',
                isClosable:true
            })
            setloading(false)
        }
    }

    const sendMessage = async () => {
        if (newMessage) {
            document.getElementById("msg").value = ""
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                setnewMessage("")
                socket.emit("new message", data)
                setMessages([...Messages, data])
                // console.log(data)


            } catch (error) {
                toast({
                    title: 'Failed to send message',
                    status: 'warning',
                    duration: '5000'
                })
            }
        }
    }
    const typingHandler = (e) => {
        setnewMessage(e.target.value)

        if(!sockedConnected) return
        if(!typing){
            settyping(true)
            socket.emit('typing', selectedChat._id)
        }
        
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        
        setTimeout(()=>{
           var timeNow = new Date().getTime()
           var timeDifference = timeNow - lastTypingTime
           if(timeDifference >= timerLength && typing){
            socket.emit('stop typing',selectedChat._id)
            settyping(false)
           }
        },timerLength)
        
    }

    useEffect(() => {
        socket=io(ENDPOINT)
        socket.emit("setup",user)
        socket.on('connected',()=>setsockedConnected(true))
        socket.on('typing',()=>{setistyping(true)})
        socket.on('stop typing',()=>{setistyping(false)})
    }, []);

    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                 //give notifications
            }else{
                setMessages([...Messages,newMessageRecieved])
            }
        })
    })

    useEffect(()=>{
       fetchMessages()
       selectedChatCompare = selectedChat
    },[selectedChat])




    return (
        <>{
            selectedChat ? (
                <>
                    <Text fontSize={{ base: "24px", md: "28px" }} pb={3} px={2} w="100%" fontFamily="work sans" display="flex" justifyContent={{ base: 'space-between' }} alignItems="center" >
                        <Button display={{ base: "flex", md: 'none' }} onClick={() => { setselectedChat("") }}><i className="fa-solid fa-arrow-left"></i></Button>
                        {
                            selectedChat.isGroupChat == false ? (
                                <>
                                    {getsender(user, selectedChat.users)}
                                    <ProfileModel user={getsenderuser(user, selectedChat.users)} />
                                </>

                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages={fetchMessages} />
                                </>
                            )
                        }
                    </Text>
                    <Box display="flex" flexDirection="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                        {loading ? (<Spinner size='xl' w={20} h={20} alignSelf="center" margin="auto" />) : (
                            <div className='messages' ><ScrollableChat Messages={Messages} /></div>
                        )}
                        <FormControl display="flex" isRequired mt={3} >
                            {istyping?<div>Typing...</div>:<></>}
                            <Input id='msg' placeholder='Enter Message...' variant="filled" bg="#E0E0E0" onChange={(e) => { typingHandler(e) }} />
                            <Button mx={3} onClick={() => { sendMessage() }} >Send</Button>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%" >
                    <Text fontSize="3xl" fontFamily="work sans" pb={3} >Click on a User to start chating</Text>
                </Box>
            )
        }</>
    )
}

export default SingleChat