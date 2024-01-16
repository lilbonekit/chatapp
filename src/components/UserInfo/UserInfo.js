import {
    Stack,
    Avatar,
    AvatarBadge,
    Heading,
    Text,
    Flex
} from "@chakra-ui/react"

import { useCurrentUser } from "../../store/store"

import useSearchStore from "../../store/searchStore"

import useChatActionsStore from "../../store/chatStore"

const UserInfo = (props) => {
    const { currentUser } = useCurrentUser()
    const { createChat, setCurrentChatId, setUserCurrentChat } = useChatActionsStore()
    const clear = useSearchStore(state => state.clear)

    const {
        email = 'Hardcode',
        type = 'info',
        lastMsg = '',
        isOnline = false,
        uid = null,
        closeDrawer = () => {}
    } = props

    const handleSelect = async () => {
        if (type !== 'messageBlock') {
            // console.log('No onClick!')
            return
        }

        createChat(currentUser, { uid, email })
        // console.log(currentUser.uid)
        setCurrentChatId(currentUser, { uid, email })
        setUserCurrentChat({ email, uid })
        clear()
        closeDrawer()
    }

    return (
        <Stack
            onClick={handleSelect}
            sx={type === 'info' ? null : { cursor: 'pointer' }}
            px={2}
            py={type === 'info' ? null : 4}
            borderBottomWidth={type === 'info' ? null : 1}
            direction='row'
            spacing={4}>
            <Avatar>
                {isOnline ? <AvatarBadge boxSize='1.25em' bg='green.500' /> : null}
            </Avatar>
            <Flex flexDirection='column' spacing={5}>
                <Heading size='s' as='h3'>
                    {email}
                </Heading>
                <Text fontSize='md' noOfLines={1}>
                    {lastMsg}
                </Text>
            </Flex>
        </Stack>
    )
}

export default UserInfo