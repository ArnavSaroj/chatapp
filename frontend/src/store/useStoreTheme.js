import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        // Update the DOM
        document.documentElement.setAttribute('data-theme', theme);
        // Update localStorage
        localStorage.setItem("chat-theme", theme);
        // Update state
        set({ theme });
    },
}))