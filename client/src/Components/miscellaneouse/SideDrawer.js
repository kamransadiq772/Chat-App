import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Toast,useToast, Tooltip, Stack, Skeleton, Spinner } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import UserListItem from '../UserAvatar/UserListItem';
import {
    Input,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';


const SideDrawer = () => {
    const navigate = useNavigate()


    const [search, setsearch] = useState("");
    const [searchresults, setsearchresults] = useState([]);
    const [loading, setloading] = useState(false);
    const [loadingChat, setloadingChat] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const toast = useToast()


    const { user,setuser,selectedChat,setselectedChat,chats,setchats } = ChatState()

    const logout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    const handleSearch = async() => {
         if(!search){
            toast({
                title:'Please entre to search',
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'top-left'
            })
            return;
         }

         try {
            setloading(true)

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`,config)

            setloading(false)
           
            setsearchresults(data)

         } catch (error) {
            toast({
                title:'Request Failed',
                description:error.response.data.message, 
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom-left'
            })
         }

    }

    const accessChat = async(userId) => {
       try {
        setloadingChat(true)

        const config = {
            headers : {
                "Content-type":"application/json",
                Authorization : `Bearer ${user.token}`
            }
        }

        const {data} = await axios.post('/api/chat',{userId},config)

        if(!chats.find((c)=>c._id===data._id)) setchats([data, ...chats])

        setloadingChat(false)
        setselectedChat(data)
        onClose()


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


    return (
        <>
            <Box display='flex' justifyContent='space-between' alignItems='center' bg='white' w="100%" borderWidth='5px' p="5px 10px 5px 10px">
                <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen} ref={btnRef}>
                        <i className='fas fa-search'></i>
                        <Text display={{ base: "none", md: "flex" }} px='4' >Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='work sans' >Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton fontSize='17px' px={1}>
                            <i className="fa-solid fa-bell"></i>
                        </MenuButton>
                        <MenuList>

                        </MenuList>
                    </Menu>
                    <Menu >
                        <MenuButton fontSize='13px' mx='5px' as={Button} rightIcon={<i className="fa-solid fa-chevron-down"></i>}>
                            <Avatar size='sm' cursor='pointer' name={user.name} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logout}>LogOut</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input mr={2} placeholder="Type Name to Seach" value={search} onChange={(e)=>{setsearch(e.target.value)}} />
                            <Button onClick={handleSearch} >Go</Button>
                        </Box>
                        {loading ? (
                           <Stack>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                            <Skeleton height='45px'/>
                           </Stack>
                        ):(
                            searchresults?.map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={()=>{accessChat(user._id)}} />
                            ))
                        )
                        }
                    </DrawerBody>
                    {loadingChat && <Spinner ml='auto' display='flex' />}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer