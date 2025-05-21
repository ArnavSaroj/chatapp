import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300 w-full">
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser.profile_pic || "/avatar.png"} 
                alt={selectedUser.fullname} 
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(String(selectedUser.id)) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button - now with absolute positioning */}
        <div className="flex-none">
          <button 
            onClick={() => setSelectedUser(null)}
            className="p-2 hover:bg-base-200 rounded-full"
          >
            <X className="size-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;