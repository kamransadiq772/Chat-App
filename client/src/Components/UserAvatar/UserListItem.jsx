import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import src from '../assets/logo512.png'

const UserListItem = ({user,handleFunction}) => {


  return (
    <Box onClick={handleFunction} cursor='pointer' bg='#E8E8E8' _hover={{bg:'#38B2AC' , color:'white'}}
    display="flex" w="100%" alignItems="center" color='black' px={3} py={2} mb={2} borderRadius="lg" >
        <Avatar mr={2} size='sm' cursor='pointer' bg="black" name={user.name} src={src} />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize='xs' ><b>Email : </b>{user.email}</Text>
        </Box>
        
    </Box>
  )
}

export default UserListItem