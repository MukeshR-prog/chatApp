import { useAppStore } from "@/store";
import React from "react";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

const ContactLists = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  console.log("header:", contacts);
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#5c5365]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-5 justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact?.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact?.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[ffffff22] border border-white/70"
                            : ` ${getColor(contact?.color)}`
                        }
                        uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full`}
                  >
                    {contact?.firstName
                      ? contact?.firstName?.split("").shift()
                      : contact?.email?.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="flex items-center justify-center bg-[#ffffff22] rounded-full h-10 w-10">
                #
              </div>
            )}
            {isChannel ? (
              <span className="text-xs text-neutral-300">{contact?.name}</span>
            ) : (
              <span className="text-xs text-neutral-300">
                {contact?.firstName ? `${contact?.firstName} ${contact?.lastName}` : contact?.email }
              </span>
            )}
          </div>
        </div>
      ))}
      {/* {contacts.map((contact)=>contact.firstName)}   */}
    </div>
  );
};

export default ContactLists;
