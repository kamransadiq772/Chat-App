import React, { useState } from 'react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,Toast, useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
    const navigate = useNavigate()
    const [show, setshow] = useState(false);
    const [name, setname] = useState();
    const [email, setemail] = useState();
    const [password, setpass] = useState();
    const [confirmpass, setconfirmpass] = useState();
    const [loading, setloading] = useState(false);
    const toast = useToast()
    const [pic, setpic] = useState();

    const handleclick = () =>{
        setshow(!show)
    }

    const postdetails = (pic) =>{
        setpic("filename")
    //    setloading(true)
    //    if(pic === undefined){
    //        toast({
    //         title:'Please Select an Image',
    //         status:"warning",
    //         duration:'5000',
    //         isClosable:true,
    //         position:'bottom'
    //        })
    //    }
    //    if(pic.type === 'image/jpeg' || pic.type ==="image/png"){
    //     const data = new FormData()
    //     data.append("file",pic)
    //     data.append("upload_preset","chat-app")
    //     data.append("cloud_name","dgmrb1csp")
    //     fetch("cloudinary://771774449957634:8XwNeCkJUGu_sCWK2vF_6lL7i3c@dgmrb1csp",{
    //         method:'post',
    //         body:data
    //     }).then((res)=>res.json())
    //     .then((data)=>{
    //         setpic(data.url.toString())
    //         setloading(false)
    //     })
    //    }else{
    //     toast({
    //         title:'Please Select an Image',
    //         status:"warning",
    //         duration:'5000',
    //         isClosable:true,
    //         position:'bottom'
    //        })
    //        setloading(false)
    //        return;
    //    }
    }

    const submithandler = async() => {
        setloading(true)
        if(!name || !email || !password || !confirmpass || !pic){
            toast({
                        title:'Fill all fields',
                        status:"warning",
                        duration:'5000',
                        isClosable:true,
                        position:'bottom'
                       })
                       setloading(false)
                       return;
        }
        if(password !== confirmpass){
            toast({
                title:'Password do not match',
                status:"warning",
                duration:'5000',
                isClosable:true,
                position:'bottom'
               })
               setloading(false)
               return;
        }

        try{
            const config = {
                headers:{
                    "Content-type":"application/json"
                }
            }
            const {data} = await axios.post("/api/user",{name,email,password,pic},config)

            toast({
                title:'Registration Successfull',
                status:"success",
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
                status:"error",
                duration:'5000',
                isClosable:true,
                position:'bottom'
               })
               setloading(false)

        }

    }


    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Entre Your Name' onChange={(e) => setname(e.target.value)} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Email' onChange={(e) => setemail(e.target.value)} />
            </FormControl>
            <InputGroup size='md'>
                <FormControl id='pass' isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type={show ? 'text' : 'password'} placeholder='Password' onChange={(e) => setpass(e.target.value)} />
                </FormControl>
                <InputRightElement width='4.5rem' ><Button h='1.75em' size='sm' onClick={handleclick}>{show ? 'Hide' : 'Show'}</Button></InputRightElement>
            </InputGroup>
            <InputGroup size='md'>
                <FormControl id='con-pass' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type={show ? 'text' : 'password'} placeholder='Confirm Password' onChange={(e) => setconfirmpass(e.target.value)} />
                </FormControl>
                <InputRightElement width='4.5rem' ><Button h='1.75em' size='sm' onClick={handleclick}>{show ? 'Hide' : 'Show'}</Button></InputRightElement>
            </InputGroup>
            <FormControl id='email'>
                <FormLabel>Upload Your Pic</FormLabel>
                <Input type='file' p={1.5} accept="image/*" onChange={(e) => postdetails(e.target.files[0])} />
            </FormControl>
            <Button colorScheme='blue' isLoading={loading} width='100%' style={{marginTop:15}} onClick={submithandler}>Sign Up</Button>
        </VStack>
    )
}

export default SignUp