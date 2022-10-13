import {createContext, useContext, useState, useEffect} from 'react'

const ChatContext = createContext()

const ChatProvider = ({children}) => {
    const [user, setuser] = useState();
    const [selectedChat, setselectedChat] = useState();
    const [chats, setchats] = useState();

    useEffect(()=>{
        setuser(JSON.parse(localStorage.getItem('user')))
    },[])

    return <ChatContext.Provider value={{user,setuser,selectedChat,setselectedChat,chats,setchats}}>{children}</ChatContext.Provider>    
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider