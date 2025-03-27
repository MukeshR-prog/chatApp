import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
    CREATE_CHANNELS,
  GET_ALL_CONTACT_ROUTES,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleSelect";

const CreateChannel = () => {
  const { addChannel } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, SetSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_CONTACT_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(res.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
        if(channelName.length>0 && selectedContacts.length>0) {
        const res = await apiClient.post(CREATE_CHANNELS,{
            name: channelName,
            members: selectedContacts.map((contact)=> contact.value)
        },{
            withCredentials: true,
        });
        if(res.status === 201){
            setChannelName("");
            SetSelectedContacts([]);
            setNewChannelModel(false);
            addChannel(res.data.channel)
        }

    }
        
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setNewChannelModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill the details for new channel</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="channel name..."
              onChange={(e) => setChannelName(e.target.value)}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none my-2"
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none text-white py-2"
              defaultOptions={allContacts}
              placeholder="Search contacts..."
              value={selectedContacts}
              onChange={SetSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg text-gray-600">
                  No results found
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
