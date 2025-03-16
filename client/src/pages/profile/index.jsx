import { useAppStore } from '@/store'
import React from 'react'

const Profile = () => {

  const { userInfo } = useAppStore();
  return (
    <div>
      <h1>Profile</h1>
      <div>
        Email : {userInfo.email}
      </div>
    </div>
  )
}

export default Profile