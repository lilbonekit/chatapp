import UserInfo from "../UserInfo/UserInfo"

import { useRef, useState, useEffect } from 'react'

import useChatActionsStore from "../../store/chatStore"

import {
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Input,
    useDisclosure,
    Flex,
    Tooltip,
    Stack,
    FormControl,
    Text,
    Box
} from '@chakra-ui/react'

import { SearchIcon } from '@chakra-ui/icons'

import ProfileMenu from "../ProfileMenu/ProfileMenu"

import { useCurrentUser } from "../../store/store"

import { db } from "../../firebase"

import useSearchStore from "../../store/searchStore"

import { doc, onSnapshot } from "firebase/firestore"

const Navbar = () => {
    const currentUser = useCurrentUser(state => state.currentUser)
    const { userCurrentChat } = useChatActionsStore()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const { error, user, userMail } = useSearchStore()
    return (
        <Flex
            justifyContent='space-between'
            as='header'
            w='full'
            position='fixed'
            borderBottomWidth='1px'
            zIndex={1}
            bg='white'
            p={5}
        >
            {/* Header */}
            {userCurrentChat && <UserInfo email={userCurrentChat?.email} lastMsg='is your interlocutor' />}
            <Flex ml='auto' gap={3}>

                <ProfileMenu />
                <Tooltip
                    hasArrow
                    label='Search a conversation'
                    p={3}
                    aria-label='A tooltip'
                    placement='bottom-start'>
                    <IconButton
                        ref={btnRef}
                        onClick={onOpen}
                        variant='solid'
                        aria-label='Done'
                        fontSize='20px'
                        px={4}
                        size={['m', 'md', 'lg']}
                        icon={<SearchIcon />}
                    />
                </Tooltip>
            </Flex>

            <Drawer
                size={['full', 'md', 'lg']}
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        <UserInfo email={currentUser?.email} isOnline={true} lastMsg='Online' />
                    </DrawerHeader>

                    <DrawerBody p='3'>
                        <SearchInput />
                        {
                            error &&
                            <Box py={5}>
                                <Text color='gray.500' textAlign='center'>{error}</Text>
                            </Box>
                        }
                        {
                            user && userMail !== '' &&
                            <Stack py={5}>
                                <Text color='gray.500'>Last search:</Text>
                                <UserInfo
                                    type='messageBlock'
                                    email={user.email}
                                    uid={user.uid}
                                />
                            </Stack>
                        }
                        <Chats closeDrawer={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    )
}

const Chats = ({ closeDrawer }) => {
    const currentUser = useCurrentUser(state => state.currentUser)
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])

    // fetch Chats realtime
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                setChats(doc.data())
            })

            return () => {
                unsub()
            }
        }

        currentUser.uid && getChats()
    }, [currentUser.uid])

    // fetch messages for this chats
    useEffect(() => {
        // Use a separate effect for each chat
        const fetchMessages = async (chatId) => {
            const unsub = onSnapshot(doc(db, 'chats', chatId), (doc) => {
                if (doc.exists()) {
                    setMessages((prevMessages) => ({
                        ...prevMessages,
                        [chatId]: doc.data().messages,
                    }))
                }
            })

            return () => {
                unsub()
            }
        }

        // Iterate through each chat and fetch messages
        if (chats) {
            Object.keys(chats).forEach((chatId) => {
                fetchMessages(chatId)
            })
        }
    }, [chats])


    const sortedChats = Object.entries(chats || []).sort(([chatId1, chat1], [chatId2, chat2]) => {
        const lastMsg1 = messages[chatId1]?.length ? messages[chatId1][messages[chatId1].length - 1] : { date: { seconds: 0 } }
        const lastMsg2 = messages[chatId2]?.length ? messages[chatId2][messages[chatId2].length - 1] : { date: { seconds: 0 } }

        return lastMsg2.date.seconds - lastMsg1.date.seconds
    });

    return (
        <Stack py={5}>
            {sortedChats.map(([chatId, chat]) => (
                <UserInfo
                    closeDrawer={closeDrawer}
                    uid={chat.userInfo.uid}
                    lastMsg={messages[chatId]?.length ? messages[chatId][messages[chatId].length - 1].text : ''}
                    email={chat.userInfo.email}
                    type='messageBlock'
                    key={chatId}
                />
            ))}
        </Stack>
    )
}

const SearchInput = () => {
    const { userMail, setSearchTerm, search, loading } = useSearchStore()

    const handleSearch = async (e) => {
        if (userMail.trim() !== '') {
            e.preventDefault()
            await search(db)
        }
    }

    return (
        <form onSubmit={handleSearch}>
            <FormControl isDisabled={loading}>
                <Input
                    required
                    value={userMail}
                    onChange={e => setSearchTerm(e.target.value)}
                    type='email'
                    size='lg'
                    placeholder='Search a user...'
                />
            </FormControl>
        </form>
    )
}

export default Navbar