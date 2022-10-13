import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useLocation,useNavigate } from 'react-router-dom'
import {ChatState} from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../Components/miscellaneouse/SideDrawer'
import MyChats from '../Components/miscellaneouse/MyChats'
import ChatBox from '../Components/miscellaneouse/ChatBox'

const ChatPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {user} = ChatState()
    const [fetchAgain, setfetchAgain] = useState(false);

  //   const fetchchats = async() => {
  //      const { data } = await axios.get('/chats'); //destructring the response object // could be const data = .... and setchats(data.data)
  //      setchats(data)
  //  }

    useEffect(() => {
      const userinfo = JSON.parse(localStorage.getItem('user'))
        if(!userinfo){
            navigate('/')
        }
    }, [location]);

  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer />}
      <Box
      display="flex" justifyContent='space-between' w='100%' h='91.5vh' flexDirection='row' p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage