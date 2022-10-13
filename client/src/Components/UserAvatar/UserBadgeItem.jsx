import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box px={2} color='white' py={1} borderRadius="lg" m={1} mb={2} variant="solid" fontSize="12px" bg="purple" cursor="pointer" onClick={handleFunction} >
     {user.name}
     <i style={{paddingLeft:"10px"}} className="fa-solid fa-xmark"></i>
    </Box>
  )
}

export default UserBadgeItem