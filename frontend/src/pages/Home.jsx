import React from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import Artifact from "../components/Artifact";
import useSyncConversationFromUrl from "../hooks/useSyncConversationFromUrl";

function Home() {
  useSyncConversationFromUrl();

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden ">
      <Sidebar/>
      <ChatArea/>
      <Artifact/>
    </div>
  );
}

export default Home;
