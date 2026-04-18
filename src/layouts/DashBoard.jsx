import React from 'react'
import { useAuthStore } from '../store.js'
import { Navigate, Outlet ,Link} from 'react-router-dom'

const DashBoard = () => {

    const {user} = useAuthStore()

    if(user===null)
    {
        return <Navigate to="/auth/login" replace= {true}/> 
    }

  return (
    <div>
        <h1>this is dashboard component</h1>
        <Outlet />
    </div>
  )
}

export default DashBoard