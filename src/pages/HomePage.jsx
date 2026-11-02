import { useAuthStore } from '@/store'
import React from 'react'
import Title from 'antd/es/skeleton/Title'
const HomePage = () => {

  const { user } = useAuthStore()
  return (
    <Title>Welcome {user?.firstName}</Title>
  )
}

export default HomePage