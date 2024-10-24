// authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("access_token"), // Pastikan token diambil dari local storage
  rToken: localStorage.getItem("refresh_token"), // Pastikan token diambil dari local storage
  setToken: (newToken) => set({ token: newToken }), // Mengatur token
  setRToken: (newRToken) => set({ rToken: newRToken }), // Mengatur rToken
}));

export default useAuthStore;
