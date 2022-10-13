import React, { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Toast, useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const [show, setshow] = useState(false);
    const [email, setemail] = useState();
    const [password, setpass] = useState();
    const [loading, setloading] = useState(false);
    const toast = useToast()
    const navigate = useNavigate()

    const handleclick = () =>{
        setshow(!show)
    }

    const submithandler = async() => {
        setloading(true)
        if(!email || !password){
            toast({
                title:'All Fields Are Required',
                status:'warning',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            setloading(false)
            return;
        }
        try{
            const config = {
                headers : {"Content-type":"application/json"}
            }  

            const {data} = await axios.post("/api/user/login",{email,password},config)

            toast({
                title:'Success',
                status:'success',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            localStorage.setItem("user",JSON.stringify(data))
            setloading(false)          
            navigate('/chats')

        }catch(err){
            toast({
                title:'Error Occured',
                description:err.response.data.message,
                status:'error',
                duration:'5000',
                isClosable:true,
                position:'bottom'
            })
            setloading(false)


        }
       

    }


    return (
        <VStack spacing='5px'>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Email' onChange={(e) => setemail(e.target.value)} />
            </FormControl>
            <InputGroup size='md'>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type={show ? 'text' : 'password'} placeholder='Password' onChange={(e) => setpass(e.target.value)} />
                </FormControl>
                <InputRightElement width='4.5rem' ><Button h='1.75em' size='sm' onClick={handleclick}>{show ? 'Hide' : 'Show'}</Button></InputRightElement>
            </InputGroup>
            <Button colorScheme='blue' isLoading={loading} width='100%' style={{marginTop:15}} onClick={submithandler}>Log In</Button>
            <Button variant='solid' colorScheme='red' width='100%' style={{marginTop:15}} onClick={()=>{
                setemail('guest@gmail.com')
                setpass('123456')
            }}>Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login
