import { animationDefault } from '@/lib/utils'
import React from 'react'
import Lottie from 'react-lottie'

const EmptyChatContainer = () => {
  return (
    <div
    className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all'
     >
        <Lottie 
        isClickToPauseDisabled={true}
        width={200}
        height={200}
        options={animationDefault}
        />
        <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-3xl transition-all duration-1000 text-center'>
            <h3>Hi <span className='text-purple-500'> !</span> ,  Welcome to my chat app</h3>
        </div>
     </div>
  )
}

export default EmptyChatContainer