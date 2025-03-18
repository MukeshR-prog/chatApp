import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { animationDefault } from "@/lib/utils";
import Lottie from "react-lottie";

const NewDm = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContacts, setSearchContact] = useState([]);
  const searchContact = async(e) => {
    console.log(e)
    setSearchContact(e)
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenNewContactModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open ={openNewContactModel} onOpenChange = {setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <Input
            placeholder = "Search contacts..."
            onChange = {(e)=>searchContact(e.target.value)}
            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          {
            searchContacts.length<=0 &&  <div
            className='flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all'
             >
                <Lottie 
                isClickToPauseDisabled={true}
                width={100}
                height={100}
                options={animationDefault}
                />
                <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-1000 text-center'>
                    <h3>Search<span className='text-purple-500'> New</span> Contacts</h3>
                </div>
             </div>
          }
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
