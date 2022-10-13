import React, { useState, useEffect } from 'react'
import { Box, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const [groupChatName, setgroupChatName] = useState();
    const [selectedUsers, setselectedUsers] = useState([]);
    const [search, setsearch] = useState("");
    const [searchResults, setsearchResults] = useState([]);
    const [loading, setloading] = useState(false);

    const toast = useToast()

    const { user, chats, setchats } = ChatState()


    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch = async(query) => {
        setsearch(query)
        if (!query) {
            return;
        }

        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`,config)
            setloading(false)
            setsearchResults(data)
            // console.log(data)

        } catch (error) {
            toast({
                title:'Request Failed',
                description:error.message, 
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
        }

    }

    const handleSubmit = async() => {
        if(!groupChatName || selectedUsers.length<2){
            toast({
                title:'Select Both Fields',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type" : "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const data = await axios.post("/api/chat/group",{
                name:groupChatName, users : JSON.stringify(selectedUsers.map(u=>u._id))
            },config);

            setchats([data.data,...chats]);
            console.log(data)
            onClose()

            toast({
                title:'New Group Chat Created',
                status:'success',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })

        } catch (error) {

            toast({
                title:'Failed to Create',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
            
        }
    }

    const handleGroup = (user) => {
        if(selectedUsers.includes(user)){
            toast({
                title:'Already In List',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
            return;
        }
        
        setselectedUsers([...selectedUsers,user])
    }

    const handleDelete = (user) => {
        setselectedUsers(selectedUsers.filter(u => u._id !== user._id))
    }




    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize='35px' fontFamily="work sans" display="flex" justifyContent="center" >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center">
                        <FormControl>
                            <Input placeholder='Group Chat Name' mb={3} onChange={(e) => { setgroupChatName(e.target.value) }} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Search User' mb={1} onChange={(e) => { handleSearch(e.target.value) }} />
                        </FormControl>
                        
                        <Box display="flex" flexWrap="wrap" maxWidth="300px" >
                        {selectedUsers.map(u => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={()=>{handleDelete(u)}} />
                        ))}
                        </Box>


                        {loading ? <div>loading...</div> : (
                            searchResults?.slice(0,4).map((user)=>(
                                <UserListItem key={user._id} user={user} handleFunction={()=>{handleGroup(user)}} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal