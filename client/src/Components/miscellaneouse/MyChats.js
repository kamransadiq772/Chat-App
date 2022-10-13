import { Box, Button, Skeleton, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { getsender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({fetchAgain}) => {

  const [loggeduser, setloggeduser] = useState();

  const { user, setuser, selectedChat, setselectedChat, chats, setchats } = ChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get("/api/chat", config)
      setchats(data)

    } catch (error) {
      toast({
        title: 'Request Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    setloggeduser(user)
    fetchChats()
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth='1px'
    >
      <Box px={3} pb={3} fontFamily='work sans' fontSize={{ base: "24px", md: '28px' }} display='flex' w='100%' alignItems='center' justifyContent='space-between' >
        My Chats
        <GroupChatModal>
          <Button display='flex' fontSize='17px' rightIcon={<i className="fa-solid fa-plus"></i>} >New Group Chat</Button>
        </GroupChatModal>
      </Box>
      <Box display="flex" flexDirection="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius='lg' overflowY="hidden" >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat,index) => (
              <Box key={index} onClick={() => { setselectedChat(chat) }} bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} borderRadius='lg' >
                <Text>
                  {chat.isGroupChat==false ? getsender(user, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack>
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default MyChats