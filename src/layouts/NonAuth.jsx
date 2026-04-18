import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store.js'


const NonAuth = () => {
    const {user} = useAuthStore();
    if(user!==null)
    {
        return <Navigate to="/" replace= {true}/>
    }
  return (
    <div>
        <h1>NonAuth</h1>
        
        <Outlet />
    </div>
  )
}

export default NonAuth