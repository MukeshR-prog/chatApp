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
    <div className='relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]'
    >
    <Logo/>
    <div className='my-3'>
        <div className='flex items-center justify-between pr-10'>
            <Title text='Direct Messages'/>
            <NewDm/>
        </div>
        <div className={`max-h-[38vh] overflow-y-auto ${directMessagesContacts.length > 5 ? 'scrollbar-hide' : ''}`}  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <ContactLists contacts={directMessagesContacts}/>
        </div>
    </div>
    <div className='my-3'>
        <div className='flex items-center justify-between pr-10'>
            <Title text='Channels'/>
            <CreateChannel/>
        </div>
        <div className={`max-h-[38vh] overflow-y-auto ${directMessagesContacts.length > 5 ? 'scrollbar-hide' : ''}`}  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <ContactLists contacts={channels} isChannel={true}/>
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