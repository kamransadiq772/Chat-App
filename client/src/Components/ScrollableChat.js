import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { isLastMessage, issamesender } from './config/ChatLogics'
import src from "./assets/logo512.png"

export const ScrollableChat = ({ Messages }) => {

    const { user } = ChatState()

    return (
        <div>
            {Messages && Messages.map((msg, index) => (
                <div style={{ display: 'flex', 
                justifyContent:`${msg.sender._id === user._id ? "flex-end":"flex-start"}`,
                  
                }} key={index} >
                    {
                        (issamesender(Messages, msg, index, user._id) ||
                        isLastMessage(Messages, index, user._id)) && (
                            <Tooltip label={msg.sender.name} placement="bottom-start" hasArrow >
                                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={msg.sender.name} src={src} />
                            </Tooltip>
                        )

                    }
                    <span
                    style={{
                        
                        backgroundColor:`${msg.sender._id === user._id ? "#BEE3F8":"#B9F5D0"}`,
                        // marginLeft:`${msg.sender._id === user._id ? 33:0 }`,
                        borderRadius:'20px',
                        padding:'5px 15px',
                        maxWidth:'75%',
                        margin:'5px'
                    }}
                    >{msg.content}</span>
                </div>
            ))}
        </div>
    )
}
