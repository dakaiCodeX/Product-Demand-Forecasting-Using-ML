import { create } from 'zustand';
import users from '@/mocks/users.json';
import type { UserProfile } from '@/types/menu';

type AuthState = {
  users: UserProfile[];
  activeUser: UserProfile;
  setActiveUser: (id: string) => void;
  hasPermission: (permission: string) => boolean;
  canAccessTest: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  users,
  activeUser: users[0],
  setActiveUser: (id) => {
    const user = users.find((candidate) => candidate.id === id);
    if (user) {
      set({ activeUser: user });
    }
  },
  hasPermission: (permission) => get().activeUser.permissions.includes(permission),
  canAccessTest: () => {
    const { activeUser } = get();
    return activeUser.roles.includes('tester') || activeUser.permissions.includes('beta-access') || activeUser.roles.includes('admin');
  },
}));
