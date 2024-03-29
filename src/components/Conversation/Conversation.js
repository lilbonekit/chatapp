import {
    Flex,
    Stack,
    Box,
    AbsoluteCenter,
    Text
} from "@chakra-ui/react"

import MessageControler from "../MessageControler/MessageControler"
import { useEffect, useState } from "react"
import { onSnapshot, doc } from "firebase/firestore"

import useChatActionsStore from "../../store/chatStore"

import { db } from '../../firebase'
import { useCurrentUser } from "../../store/store"

const Conversation = () => {
    const [messages, setMessages] = useState([])
    const { chatId } = useChatActionsStore()
    const { currentUser } = useCurrentUser()

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    }, [messages])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
            // console.log(doc)
        })
        
        return () => {
            unsub()
        }
    }, [chatId])
    
    // console.log(messages)

    return (
        <Flex py={10} flexDirection='column' gap={30}>
            {currentUser && (
                <Stack my={'80px'}>
                    {messages.length > 0 ? (
                        messages.map((m) => (
                            // console.log(currentUser.uid, m.senderId) ||
                            <Box
                                size={['xs', 'md', 'xl']}
                                sx={{maxW: '80%'}}
                                key={m.id}
                                bg={`${currentUser.uid === m.senderId ? 'green.100' : 'white'}`}
                                alignSelf={`${currentUser.uid === m.senderId ? 'flex-end' : 'flex-start'}`}
                                // w='50px' 
                                p={3}
                                borderRadius={10}
                            >
                                {m.text}
                            </Box>
                        ))
                    ) : (
                        <AbsoluteCenter>
                            <Text color='green.200' fontSize={['md', null, '4xl']} textAlign='center'>
                            {chatId === 'null' ? 'Select a chat' : 'No messages'}
                            </Text>
                        </AbsoluteCenter>
                    )}
                    <MessageControler />
                </Stack>
            )}
        </Flex>
    );
}

export default Conversation