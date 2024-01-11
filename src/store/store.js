import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase'

export const useCurrentUser = create(devtools((set, get) => ({
    currentUser: null,
    loading: false,
    error: null,
    getCurrentUser: async (email, password) => {
        set({ loading: true, error: null })
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            get().setCurrentUser(user.email)
            return user.email
        } catch (error) {
            // const errorCode = error.code
            const errorMessage = error.message
            
            set({
                error: errorMessage,
                loading: false
            })

            throw error
        }
    },
    createUser: async (email, password) => {
        set({ loading: true, error: null })
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            console.log(user)

            get().setCurrentUser(user.email)
            return user.email
        } catch (error) {
            const errorCode = error.code
            const errorMessage = error.message
    
            console.log(error.code)

            console.error(errorCode)
            
            set({
                error: errorMessage,
                loading: false
            })
            throw error
        }
    },
    setCurrentUser: (email) => {
        const newUser = { email, isAuth: !!email }

        set({
            currentUser: newUser,
            loading: false,
            error: null
        })
        console.log(get().currentUser)
    },
    removeCurrentUser: () => {
        set({ currentUser: null })
        console.log(get().currentUser)
    }
})))