import { create } from 'zustand';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCurrentUser = create(
  persist((set, get) => ({
    currentUser: null,
    loading: false,
    error: null,
    getCurrentUser: async (email, password) => {
      set({ loading: true, error: null });

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        get().setCurrentUser(user.email, user.uid);
        set({ currentUser: user });
        return user.email;
      } catch (error) {
        const errorMessage = error.message;

        set({
          error: errorMessage,
          loading: false
        });

        throw error;
      }
    },
    createUser: async (email, password) => {
      set({ loading: true, error: null });

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        get().setCurrentUser(user.email, user.uid);
        const userDocRef = doc(db, 'users', user.uid);

        await setDoc(userDocRef, {
          email,
          uid: user.uid
        });

        await setDoc(doc(db, 'userChats', user.uid), {});

        set({ currentUser: user });
        return user.email;
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error.code);

        console.error(errorCode);

        set({
          error: errorMessage,
          loading: false
        });
        throw error;
      }
    },
    setCurrentUser: (email, uid) => {
      const newUser = { email, isAuth: !!email, uid };

      set({
        currentUser: newUser,
        loading: false,
        error: null
      });
      console.log(get().currentUser);
    },
    removeCurrentUser: () => {
      set({ currentUser: null });
      // console.log(get().currentUser)
    }
  }),
  {
    name: 'store', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  }
));

