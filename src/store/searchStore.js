// searchStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { collection, query, where, getDocs } from "firebase/firestore";

const useSearchStore = create(
    persist(
        (set, get) => ({
            userMail: '',
            user: null,
            error: false,
            loading: false,
            clear: () => set({ user: null, userMail: '', error: false, loading: false }),
            setSearchTerm: (term) => set({ userMail: term, error: false }),
            search: async (db) => {
                try {
                    set({ loading: true, error: false, user: null });

                    const q = query(collection(db, 'users'), where('email', '==', get().userMail));
                    const querySnapshot = await getDocs(q);

                    if (querySnapshot.empty) {
                        throw new Error(`"${get().userMail}" is not found!`);
                    }

                    querySnapshot.forEach((doc) => {
                        set({ user: doc.data(), error: false, loading: false });
                        console.log(doc.data());
                    });
                } catch (error) {
                    set({ error: error.message, loading: false, user: null });
                    console.error(error.message);
                }
            },
        }),
        {
            name: 'searchStore', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    )
);

export default useSearchStore;
