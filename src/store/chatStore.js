import { create } from 'zustand';
import { db } from '../firebase';
import { getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { persist, createJSONStorage } from 'zustand/middleware';

const useChatActionsStore = create(
    persist((set, get) => ({
        chatId: 'null',  // Инициализация null
        userCurrentChat: null,
        clearChatState: () => set({ chatId: 'null', userCurrentChat: null }),
        setUserCurrentChat: (user) => set({ userCurrentChat: user }),
        setCurrentChatId: (currentUser, targetUser) => {
            const combinedId = currentUser.uid > targetUser.uid
                ? currentUser.uid + targetUser.uid
                : targetUser.uid + currentUser.uid;
            set({ chatId: combinedId });
        },
        createChat: async (currentUser, targetUser) => {
            const { chatId } = get();

            // Добавляем проверку на null
            if (chatId !== null) {
                const combinedId = currentUser.uid > targetUser.uid
                    ? currentUser.uid + targetUser.uid
                    : targetUser.uid + currentUser.uid;

                try {
                    const res = await getDoc(doc(db, 'chats', combinedId))

                    if (!res.exists()) {
                        await setDoc(doc(db, 'chats', combinedId), { messages: [] })

                        await updateDoc(doc(db, 'userChats', currentUser.uid), {
                            [combinedId + '.userInfo']: {
                                uid: targetUser.uid,
                                email: targetUser.email,
                            },
                            [combinedId + '.data']: serverTimestamp(),
                        })
                        

                        await updateDoc(doc(db, 'userChats', targetUser.uid), {
                            [combinedId + '.userInfo']: {
                                uid: currentUser.uid,
                                email: currentUser.email,
                            },
                            [combinedId + '.data']: serverTimestamp(),
                        })

                        set({ chatId: combinedId })
                        console.log(get().chatId)
                    }
                } catch (error) {
                    console.error('Error creating chat:', error)
                }
            }
        },
    }),
        {
            name: 'chatActionStorage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    ));

export default useChatActionsStore;
