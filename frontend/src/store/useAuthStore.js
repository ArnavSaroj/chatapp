import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const BASE_URL=import.meta.env.MODE ==="development"? "http://localhost:5000":"/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningup: false,
  isLogging: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authUser: null });
    } finally {
      set({ ischeckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningup: false });
    }
    return false;
  },

  login: async (data) => {
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });
      toast.success("logged in succesfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogging: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logged out succesfuly");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update_profile", data);
      set({ authUser: res.data });
      toast.success("profile picture updated succesfuly");
    } catch (error) {
      console.error(error.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => { 
    const { authUser } = get()
    if (!authUser || get().socket?.connected)return;
  
  
    const socket = io(BASE_URL, {
      query: {
      userId:authUser.id
    }})
    socket.connect()
    set({ socket: socket });

    socket.on("getOnlineusers",(userIds)=> {
  set({onlineUsers:userIds})
    })

  },
  
  disconnectSocket: () =>{
    if (get().socket?.connected) get().socket.disconnect();
  },  
}));
