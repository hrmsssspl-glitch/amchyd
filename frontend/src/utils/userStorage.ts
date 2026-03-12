import { User } from '../types';
import { INITIAL_USERS } from '../data/mockUsers';

const STORAGE_KEY = 'hrms_users';

export const userStorage = {
    getUsers: (): User[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_USERS;
    },

    saveUsers: (users: User[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },

    // Helper to sync initial users if empty
    initialize: () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
        }
    }
};
