import { ChevronDownIcon } from '@chakra-ui/icons'

import { useCurrentUser } from '../../store/store'

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Button
} from '@chakra-ui/react'
import useSearchStore from '../../store/searchStore'
import useChatActionsStore from '../../store/chatStore'

const ProfileMenu = () => {
    const {currentUser, removeCurrentUser} = useCurrentUser()
    const clear = useSearchStore(state => state.clear)
    const clearChatState = useChatActionsStore(state => state.clearChatState)

    const handleLeaveSignOut = () => {
        removeCurrentUser()
        clear()
        clearChatState()
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button size={['ms', 'md', 'lg']} px={3} rightIcon={<ChevronDownIcon/>}>Profile</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{currentUser?.email}</PopoverHeader>
                <PopoverBody>
                    <Button 
                        colorScheme='red'
                        variant='ghost'
                        onClick={handleLeaveSignOut}
                    >
                        Log out
                    </Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default ProfileMenu