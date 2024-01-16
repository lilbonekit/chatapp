import {
    // Textarea,
    Box,
    // Container,
    IconButton, 
    Input
} from "@chakra-ui/react"

import { ArrowRightIcon } from '@chakra-ui/icons'
import { useCurrentUser } from "../../store/store"
import useChatActionsStore from "../../store/chatStore"

import { useState } from "react"
import { arrayUnion, doc, updateDoc, Timestamp } from "firebase/firestore"

import { db } from "../../firebase"

import {v4 as uuid} from 'uuid'

const MessageControler = () => {
    const {currentUser} = useCurrentUser()
    const {chatId, userCurrentChat} = useChatActionsStore()
    const [isLoading, setIsLoading] = useState(false)

    const [text, setText] = useState('')

    const handleSend = async (e) => {
        e.preventDefault()
        if(text.trim() === '') return

        try {
            setIsLoading(true)
            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
            setText('')
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error('Error sending message:', error)
        }
    }

    return (
        (currentUser && userCurrentChat) &&
        <Box
            bg='white'
            pt={1}
            position='fixed'
            bottom={0}
            w='full'
            left={0}
        >
            <Box py={5} w={['xs', 'sm', 'md', 'lg', '4xl', '5xl']} m='auto'>
                <form onSubmit={handleSend} style={{display: 'flex', gap: 15}} disabled={isLoading}>
                    <Input
                        isDisabled={isLoading}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        resize='none'
                        variant='sfilled'
                        bg='gray.200'
                        placeholder='Message'
                        required
                        size='lg'
                        p={5}
                    />
                    <IconButton 
                        type='submit'
                        isRound={true}
                        size='lg'
                        bg='gray.200'
                        icon={<ArrowRightIcon />}
                    />
                </form>

            </Box>
        </Box>
    )
}
export default MessageControler