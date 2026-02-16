import Logo from '@/assets/logo'
import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info'
import NewDm from './components/new-dm'
import { apiClient } from '@/lib/api-client'
import { GET_DM_CONTACT_ROUTES, GET_USER_CHANNEL } from '@/utils/constants'
import { useAppStore } from '@/store'
import ContactLists from '@/components/contact-list'
import CreateChannel from './components/create-channel'

const ContactContainer = () => {
    const { directMessagesContacts,setDirectMessagesContacts,channels,setChannels } = useAppStore();
    useEffect(() =>{
        const getContacts= async () => {
            const res = await apiClient.get(GET_DM_CONTACT_ROUTES,{withCredentials:true})
            if(res.data.contacts){
                console.log("response   : ",res.data.contacts)
                setDirectMessagesContacts(res.data.contacts)
            }
        };
        const getChannels= async () => {
            const res = await apiClient.get(GET_USER_CHANNEL,{withCredentials:true})
            if(res.data.channels){
                console.log("response channel : ",res.data.contacts)
                setChannels(res.data.channels)
            }
        };
        getContacts()
        getChannels()
    },[setDirectMessagesContacts,setChannels]);
    useEffect(() => {
        console.log("Updated state:", directMessagesContacts);
      }, [directMessagesContacts]);

  return (
    <div className='relative h-screen w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] flex flex-col'>
    <Logo/>
    <div className='flex-1 flex flex-col min-h-0 pb-20'>
        {/* Direct Messages Section */}
        <div className='flex-1 flex flex-col min-h-0 my-2'>
            <div className='flex items-center justify-between pr-10 flex-shrink-0'>
                <Title text='Direct Messages'/>
                <NewDm/>
            </div>
            <div className='flex-1 overflow-y-auto min-h-0' style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a4a4a #1b1c24' }}>
                <ContactLists contacts={directMessagesContacts}/>
            </div>
        </div>
        {/* Channels Section */}
        <div className='flex-1 flex flex-col min-h-0 my-2'>
            <div className='flex items-center justify-between pr-10 flex-shrink-0'>
                <Title text='Channels'/>
                <CreateChannel/>
            </div>
            <div className='flex-1 overflow-y-auto min-h-0' style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a4a4a #1b1c24' }}>
                <ContactLists contacts={channels} isChannel={true}/>
            </div>
        </div>
    </div>
    <ProfileInfo/>
    </div>
  )
}
 const Title = ({text})=>{
    return (
        <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>
    )
 }
export default ContactContainer