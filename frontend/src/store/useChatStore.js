import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isuserloading: false,
  ismessagesloading: false,

  getUsers: async () => {
    set({ isuserloading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isuserloading: false });
    }
  },

  getMessages: async (id) => {
    set({ ismessagesloading: true });
    try {
      const res = await axiosInstance.get(`/messages/${id}`);
      set({ messages: res.data });
    } catch (error) {
      const errorMessage =
        error.response.data.message ||
        "An error occurred while fetching messages.";
      toast.error(errorMessage);
    } finally {
      set({ ismessagesloading: false });
    }
  },


  sendMessages: async (Messagedata) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser.id}`,
        Messagedata
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      const errorMessage =
        error.response.data.message ||
        "An error occurred while sending the message.";
      toast.error(errorMessage);
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  // TODOoptimize it later
  SubscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

 if (!socket) {
    console.error("Socket is not initialized");
    return;
  }

    socket.on("newMessage", (newMessage) => {
      if (newMessage.sender_id !== selectedUser.id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  UnSubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
