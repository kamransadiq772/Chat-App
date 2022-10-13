import React from 'react'
import { useDisclosure, Modal, Button, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, ModalHeader, Image, Text } from '@chakra-ui/react'
import src from '../assets/logo512.png'

const ProfileModel = ({ user, children }) => {

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <i className="fa-solid fa-eye" onClick={onOpen}></i>
                )
            }
            <Modal size='lg' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        justifyContent="center"
                        display="flex"
                        fontFamily="work sans"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' alignItems='center'>
                        <Image
                         borderRadius="full"
                         bg='gray'
                         boxSize='150px'
                         src={src}                         
                        />
                        <Text fontSize={{base:'22px', md :'25px'}} fontFamily='work sans'>Email : {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModel