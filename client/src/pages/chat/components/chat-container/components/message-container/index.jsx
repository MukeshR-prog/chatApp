import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages } =
    useAppStore();

  useEffect(() => {
    const getMessages = async () =>{
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES,
          {id: selectedChatData._id},
          {withCredentials: true}
        );
        if(res.data.messages){
          setSelectedChatMessages(res.data.messages);
        }
        
      } catch (error) {
        console.error(error);
      }
    };
      if(selectedChatData._id){
        if(selectedChatType==="contact") getMessages();
      }
    
  }, [selectedChatType, selectedChatData,setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

const checkIfImage = (filePath) => {
  const imagrRegex = /\.(jpg|jpeg|png|gif|svg|ico|heic|heif|webf|tif|tiff|bmp)$/i;
  return imagrRegex.test(filePath);
};

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index} className="message">
          {showDate && (
            <div className="text-gray-500 text-center my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender !== selectedChatData._id ? " text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
  {
    message.messageType==="file" &&  <div
    className={`${
      message.sender !== selectedChatData._id
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
        : " bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
    } border inline-block px-4 py-2 rounded my-1 max-w-[50%] break-words`}
  >
    {checkIfImage(message.fileUrl)}
  </div>
  }
        <div className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };
  console.log("selectedChatMessages:", selectedChatMessages);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
