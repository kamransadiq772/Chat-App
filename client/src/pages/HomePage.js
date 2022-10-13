import React,{useEffect} from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useLocation,useNavigate } from 'react-router-dom'

const HomePage = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('user'))
        if(userinfo){
            navigate('/chats')
        }
    }, [location]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex' justifyContent='center' w='100%' borderRadius="lg" borderWidth='1px' m='40px 0px 15px 0px' >
                <Text bg='white' fontSize='4xl' color='black' textAlign='center' fontFamily='Work sans' >Chat App Login</Text>
            </Box>
            <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
                <Tabs variant='soft-rounded'>
                    <TabList mb='1em'>
                        <Tab w='50%'>Log In</Tab>
                        <Tab w='50%'>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage