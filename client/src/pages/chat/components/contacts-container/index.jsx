import Logo from '@/assets/logo'
import React from 'react'
import ProfileInfo from './components/profile-info'
import NewDm from './components/new-dm'

const ContactContainer = () => {
  return (
    <div className='relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]'
    >
    <Logo/>
    <div className='my-3'>
        <div className='flex items-center justify-between pr-10'>
            <Title text='Direct Messages'/>
            <NewDm/>
        </div>
    </div>
    <div className='my-3'>
        <div className='flex items-center justify-between pr-10'>
            <Title text='Channels'/>
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