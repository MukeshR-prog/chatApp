import { useSocket } from "@/context/socketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const { selectedChatType,selectedChatData,userInfo} = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();

  useEffect(() =>{
    function handleClickOutside(event) {
        if (emojiRef.current && !emojiRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  },[emojiRef])
  const handleAddEmoji = (emoji)=>{
    setMessage((msg)=>msg+emoji.emoji)
  }
  const handleSendMessage = () => {
    if( selectedChatType==="contact"){
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content : message,
        recipient:selectedChatData._id,
        messageType: "text",
        fileUrl :undefined,
      })
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d2] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
           className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
             theme="dark"
             onEmojiClick={handleAddEmoji}
             open={showEmojiPicker}
             autoFocusSearch={false}
             />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
