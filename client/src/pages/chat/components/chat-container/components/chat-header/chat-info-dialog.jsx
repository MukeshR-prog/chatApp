import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  HOST,
  GET_CHANNEL_DETAILS,
  ADD_CHANNEL_MEMBER,
  REMOVE_CHANNEL_MEMBER,
  GET_ALL_CONTACT_ROUTES,
} from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FaPlus, FaTrash, FaCrown } from "react-icons/fa";
import { toast } from "sonner";
import MultipleSelector from "@/components/ui/multipleSelect";

const ChatInfoDialog = ({ open, onOpenChange }) => {
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const [channelDetails, setChannelDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  const fetchChannelDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `${GET_CHANNEL_DETAILS}/${selectedChatData._id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setChannelDetails(res.data.channel);
        // Check if current user is admin
        const adminCheck = res.data.channel.admin.some(
          (admin) => admin._id === userInfo.id
        );
        setIsAdmin(adminCheck);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch channel details");
    } finally {
      setLoading(false);
    }
  }, [selectedChatData?._id, userInfo.id]);

  const fetchAllContacts = useCallback(async () => {
    try {
      const res = await apiClient.get(GET_ALL_CONTACT_ROUTES, {
        withCredentials: true,
      });
      // Filter out existing members - convert to strings for comparison
      const existingMemberIds = [
        ...channelDetails.members.map((m) => m._id.toString()),
        ...channelDetails.admin.map((a) => a._id.toString()),
      ];
      const filteredContacts = res.data.contacts.filter(
        (contact) => !existingMemberIds.includes(contact.value.toString())
      );
      setAllContacts(filteredContacts);
    } catch (error) {
      console.error(error);
    }
  }, [channelDetails]);

  useEffect(() => {
    if (open && selectedChatType === "channel" && selectedChatData?._id) {
      fetchChannelDetails();
    }
  }, [open, selectedChatData?._id, selectedChatType, fetchChannelDetails]);

  useEffect(() => {
    if (showAddMember && channelDetails) {
      fetchAllContacts();
    }
  }, [showAddMember, channelDetails, fetchAllContacts]);

  const handleAddMember = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }
    setAddingMember(true);
    try {
      for (const contact of selectedContacts) {
        await apiClient.post(
          `${ADD_CHANNEL_MEMBER}/${selectedChatData._id}`,
          { memberId: contact.value },
          { withCredentials: true }
        );
      }
      toast.success("Member(s) added successfully");
      setSelectedContacts([]);
      setShowAddMember(false);
      fetchChannelDetails();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setRemovingMember(memberId);
    try {
      const res = await apiClient.post(
        `${REMOVE_CHANNEL_MEMBER}/${selectedChatData._id}`,
        { memberId },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Member removed successfully");
        fetchChannelDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to remove member");
    } finally {
      setRemovingMember(null);
    }
  };

  const renderContactProfile = () => (
    <div className="flex flex-col items-center gap-4 py-4">
      <Avatar className="h-24 w-24 rounded-full overflow-hidden">
        {selectedChatData?.image ? (
          <AvatarImage
            src={`${HOST}/${selectedChatData?.image}`}
            alt="profile"
            className="object-cover w-full h-full bg-black"
          />
        ) : (
          <div
            className={`uppercase h-24 w-24 text-3xl border-[1px] flex items-center justify-center rounded-full ${getColor(
              selectedChatData?.color || selectedChatData?.selectedColor
            )}`}
          >
            {selectedChatData?.firstName
              ? selectedChatData?.firstName?.charAt(0)
              : selectedChatData?.email?.charAt(0)}
          </div>
        )}
      </Avatar>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">
          {selectedChatData?.firstName && selectedChatData?.lastName
            ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
            : ""}
        </h3>
        <p className="text-gray-400">{selectedChatData?.email}</p>
      </div>
    </div>
  );

  const renderChannelInfo = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!channelDetails) return null;

    return (
      <div className="flex flex-col gap-4 py-4">
        {/* Channel Name */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center bg-[#ffffff22] rounded-full h-16 w-16 text-2xl">
            #
          </div>
          <h3 className="text-xl font-semibold text-white">
            {channelDetails.name}
          </h3>
        </div>

        {/* Admin Section */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <FaCrown className="text-yellow-500" /> Admin
          </h4>
          <div className="space-y-2">
            {channelDetails.admin.map((admin) => (
              <div
                key={admin._id}
                className="flex items-center gap-3 p-2 rounded-lg bg-[#2a2b33]"
              >
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {admin?.image ? (
                    <AvatarImage
                      src={`${HOST}/${admin?.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase h-10 w-10 text-sm border-[1px] flex items-center justify-center rounded-full ${getColor(
                        admin?.color
                      )}`}
                    >
                      {admin?.firstName
                        ? admin?.firstName?.charAt(0)
                        : admin?.email?.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    {admin.firstName && admin.lastName
                      ? `${admin.firstName} ${admin.lastName}`
                      : admin.email}
                  </p>
                  <p className="text-gray-400 text-xs">{admin.email}</p>
                </div>
                {admin._id === userInfo.id && (
                  <span className="text-xs text-purple-400">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Members Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-400">
              Members ({channelDetails.members.length})
            </h4>
            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 h-8"
                onClick={() => setShowAddMember(!showAddMember)}
              >
                <FaPlus className="mr-1" /> Add
              </Button>
            )}
          </div>

          {/* Add Member Section */}
          {showAddMember && isAdmin && (
            <div className="mb-4 p-3 rounded-lg bg-[#2a2b33]">
              <MultipleSelector
                className="rounded-lg bg-[#1b1c24] border-none text-white py-2 mb-2"
                defaultOptions={allContacts}
                placeholder="Search contacts..."
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-sm text-gray-600">
                    No contacts found
                  </p>
                }
              />
              <Button
                className="w-full bg-purple-700 hover:bg-purple-900"
                onClick={handleAddMember}
                loading={addingMember}
                size="sm"
              >
                {addingMember ? "Adding..." : "Add Members"}
              </Button>
            </div>
          )}

          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-2">
              {channelDetails.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#2a2b33]"
                >
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                    {member?.image ? (
                      <AvatarImage
                        src={`${HOST}/${member?.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`uppercase h-10 w-10 text-sm border-[1px] flex items-center justify-center rounded-full ${getColor(
                          member?.color
                        )}`}
                      >
                        {member?.firstName
                          ? member?.firstName?.charAt(0)
                          : member?.email?.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </p>
                    <p className="text-gray-400 text-xs">{member.email}</p>
                  </div>
                  {member._id === userInfo.id && (
                    <span className="text-xs text-purple-400">(You)</span>
                  )}
                  {isAdmin && member._id !== userInfo.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                      onClick={() => handleRemoveMember(member._id)}
                      loading={removingMember === member._id}
                    >
                      {removingMember !== member._id && <FaTrash />}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#181920] border-none text-white max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {selectedChatType === "contact" ? "Contact Info" : "Channel Info"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a4a4a #1b1c24' }}>
          {selectedChatType === "contact"
            ? renderContactProfile()
            : renderChannelInfo()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInfoDialog;
