import Navbar from "../../components/Navbar/Navbar"
import {
	Box,
	AbsoluteCenter,
	Text
} from "@chakra-ui/react"

import Conversation from "../../components/Conversation/Conversation"

function HomePage() {
	const currentConversation = true

	const renderObj = {
		currentConversation: <Conversation/>,
		start: <StartMessage/>
	}

	return (
		<Box>
			<Navbar />
			<Box pb={5}>
				<Box
					bg='gray.50'
					minHeight='100vh'
					width='full'
					position='absolute' right='0'
					bgGradient='linear(to-r, teal.400, green.400)'
				>
					<Box
						px={5}
						w={['xs', 'sm', 'md', 'lg', '4xl', '5xl']}
						mx='auto'
					>
						{
							currentConversation ? renderObj.currentConversation : renderObj.start
						}
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

const StartMessage = () => {
	return (
		<AbsoluteCenter px='4'>
			<Text textAlign='center' color='green.100' fontSize='2xl'>
				Start your first conversation
			</Text>
		</AbsoluteCenter>
	)
}

export default HomePage