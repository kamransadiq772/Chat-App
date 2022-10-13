import React, { useState, useEffect } from 'react'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setfetchAgain, fetchMessages }) => {

    const { user, setuser, selectedChat, setselectedChat, chats, setchats } = ChatState()
    const [groupChatName, setgroupChatName] = useState();
    const [search, setsearch] = useState("");
    const [searchResults, setsearchResults] = useState([]);
    const [loading, setloading] = useState(false);
    const [renameloading, setrenameloading] = useState(false);

    const toast = useToast()



    const handleRename = async () => {
        setrenameloading(true)
        if (!groupChatName) return
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = axios.put('/api/chat/rename', { chatId: selectedChat._id, chatName: groupChatName }, config);
            setselectedChat(data);
            setfetchAgain(!fetchAgain)
            setrenameloading(false)

        } catch (error) {
            toast({
                title: 'Failed to Rename',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setrenameloading(false)
        }
        setgroupChatName("")
    }

    const handleSearch = async (query) => {
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

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setloading(false)
            setsearchResults(data)
            // console.log(data)

        } catch (error) {
            toast({
                title: 'Request Failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setloading(false)
        }

    }

    const handleAddUser = async (u) => {
        if (selectedChat.users.find(us => us._id === u._id)) {
            toast({
                title: 'Already in Group',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can Add User',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }

        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: u._id
            }, config)

            setselectedChat(data)
            setfetchAgain(!fetchAgain)
            setloading(false)

        } catch (error) {
            toast({
                title: 'Failed to add user',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setloading(false)
        }

    }

    const handleRemove = async (u) => {
        if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
            toast({
                title: 'Only Admin can remove User',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }

        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
    
            const {data} = await axios.put('/api/chat/groupremove',{
                chatId : selectedChat._id,
                userId : u._id
            },config)
    
            u._id === user._id ? setselectedChat() : setselectedChat(data)
            setfetchAgain(!fetchAgain)
            fetchMessages()
            setloading(false)
    
           } catch (error) {
            toast({
                title:'Failed to remove user',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
            setloading(false)
           }

    }


    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <i className="fa-solid fa-eye" onClick={onOpen}></i>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontFamily="work sans" fontSize="31px" display="flex" justifyContent="center" >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" flexWrap="wrap" pb={3} >{selectedChat.users.map(u => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => { handleRemove(u) }} />
                        ))}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder='Chat name' mb={3} onChange={(e) => { setgroupChatName(e.target.value) }} />
                            <Button isLoading={renameloading} onClick={handleRename} variant="solid" colorScheme="teal" ml={1} >Update</Button>
                        </FormControl>
                        <FormControl >
                            <Input placeholder='Add User to Group' mb={1} onChange={(e) => { handleSearch(e.target.value) }} />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResults?.map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => { handleAddUser(user) }} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => { handleRemove(user) }}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal