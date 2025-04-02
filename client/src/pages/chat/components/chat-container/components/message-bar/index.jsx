import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setFileUploadProgress,
    setIsUploading,
  } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();
  const fileInputRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };
  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
      console.log(file);
    } catch (error) {
      setIsUploading(false);
      console.error(error);
    }
  };
  // return (
  //   <div className="h-[10vh] bg-[#1c1d2] flex justify-center items-center px-8 mb-6 gap-6">
  //     <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
  // <input
  //   type="text"
  //   placeholder="Type a message..."
  //   value={message}
  //   onChange={(e) => setMessage(e.target.value)}
  //   className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
  // />
  // <button
  //   onClick={handleAttachFile}
  //   className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
  // >
  //   <GrAttachment className="text-2xl" />
  // </button>
  // <input
  //   className="hidden"
  //   type="file"
  //   onChange={handleAttachmentChange}
  //   // accept=".png,.jpg,.jpeg"
  //   // style={{ display: "none" }}
  //   ref={fileInputRef}
  // />
  // <div className="relative">
  //   <button
  //     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
  //     className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
  //   >
  //     <RiEmojiStickerLine className="text-2xl" />
  //   </button>
  //   <div className="absolute bottom-16 right-0" ref={emojiRef}>
  //     <EmojiPicker
  //       theme="dark"
  //       onEmojiClick={handleAddEmoji}
  //       open={showEmojiPicker}
  //       autoFocusSearch={false}
  //     />
  //   </div>
  // </div>
  //     </div>
      // <button
      //   onClick={handleSendMessage}
      //   className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
      // >
      //   <IoSend className="text-2xl" />
      // </button>
  //   </div>
  // );

  return (
    <div className="w-full h-[9vh] mb-5 flex flex-row justify-between px-2 gap-3">
      <div className="flex w-full rounded-md bg-[#2a2b33] flex-row justify-between px-2 items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className=" p-4 rounded-md w-full focus:border-none focus:outline-none"
        />
        <div className="flex flex-row gap-4 items-center">
          <button
            onClick={handleAttachFile}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <GrAttachment className="text-2xl" />
          </button>
          <input
            className="hidden"
            type="file"
            onChange={handleAttachmentChange}
            ref={fileInputRef}
          />
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            >
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
      </div>
      <div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
      </div>
    </div>
  );
};

export default MessageBar;
