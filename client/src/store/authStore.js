import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setUser: (user) => set({ user }),
  logout: () => set({ isAuthenticated: false, user: null })
}));

export default useAuthStore;
