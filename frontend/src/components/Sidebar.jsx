import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Coins, MessageSquare, PanelLeftClose, PanelLeftOpen, PlusIcon, User } from "lucide-react";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";
import api from "../utils/axios";
import { setUserData } from "../redux/userSlice";

function Sidebar() {
  const { userData } = useSelector((state) => state.user);
  const [open, setOpen] = useState(window.innerWidth >= 768);
  const [avatarError, setAvatarError] = useState(false);
  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();
      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data))
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async()=>{
    try {
      await api.get("/api/auth/logout")
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-2.5 left-3 z-20 p-2 rounded-lg text-slate-300 hover:bg-white/10 cursor-pointer"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}


      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <div
        className={`fixed md:relative top-0 z-40 h-full shrink-0 bg-[#0d0f14] border-r border-white/8 overflow-hidden transition-all duration-300 ${
          open ? "left-0 w-64" : "-left-64 w-64 md:left-0 md:w-14"
        }`}
      >

        <div className={`hidden md:flex absolute inset-y-0 left-0 w-14 flex-col items-center py-4 gap-2 transition-opacity duration-200 ${open ? "opacity-0 pointer-events-none" : "opacity-100 delay-300"}`}>
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
            >
              <PanelLeftOpen size={18} />
            </button>
            <button
              onClick={handleCreateConversation}
              title="New Chat"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <PlusIcon size={18} />
            </button>
            <div className="flex-1 overflow-y-auto flex flex-col items-center gap-1 mt-2">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  title={conv.title}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`p-2 rounded-lg cursor-pointer ${selectedConversation?._id == conv?._id ? "bg-indigo-500/15 text-indigo-200" : "text-slate-500 hover:bg-white/5"}`}
                >
                  <MessageSquare size={16} />
                </button>
              ))}
            </div>
            <img
              src={userData?.avatar}
              alt="dp"
              className="w-8 h-8 rounded-full object-cover bg-white/10 shrink-0"
            />
        </div>


        <div className={`w-64 h-full flex flex-col transition-opacity duration-150 ${open ? "opacity-100 delay-150" : "md:opacity-0 md:pointer-events-none"}`}>

          <div className="p-4 flex items-center justify-between">
            <img src="/logo.svg" alt="PraxisAI" className="h-20 w-auto" />
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 cursor-pointer"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>


          <div className="px-4">
            <button
              className="w-full py-2 flex justify-center items-center gap-1 rounded-lg bg-white/5 hover:bg-white/7 text-sm cursor-pointer"
              onClick={handleCreateConversation}
            >
              <PlusIcon size={17} />
              <p className="font-medium">New Chat</p>
            </button>
          </div>


          <div className="flex-1 overflow-y-auto px-4 mt-5 flex flex-col">
            <p className="text-xs text-slate-500 mb-2 tracking-widest">
              RECENT
            </p>
            {conversations.length > 0 ? (
              <div className="flex flex-col gap-1">
                {conversations.map((conv) => {
                  const isActive = selectedConversation?._id == conv?._id;
                  return (
                    <div
                      key={conv._id}
                      className={`px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center gap-2 ${isActive ? "bg-indigo-500/15 text-indigo-100 hover:bg-indigo-500/20" : " text-slate-300 hover:bg-white/5"}`}
                      onClick={() => {
                        dispatch(setSelectedConversation(conv));
                        if (window.innerWidth < 768) setOpen(false);
                      }}
                    >
                      <MessageSquare size={14} className="shrink-0 text-slate-600 opacity-35" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-500 opacity-35">
                  No recent conversations
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 p-4 border-t border-white/8 flex items-center gap-3">
            {userData?.avatar && !avatarError ? (
              <img
                src={userData.avatar}
                alt="dp"
                onError={() => setAvatarError(true)}
                className="w-9 h-9 rounded-full object-cover bg-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400">
                <User size={18} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{userData?.name || "User"}</p>
              <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-px rounded-full text-[10px] text-indigo-300 bg-indigo-400/10 border border-indigo-400/20">
                <Coins size={10} className="shrink-0" />
                Free plan
              </span>
            </div>
            <button className="text-xs text-slate-400 hover:text-white cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
