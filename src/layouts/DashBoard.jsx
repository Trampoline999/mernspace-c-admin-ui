import React from 'react'
import { Outlet } from 'react-router-dom'

const DashBoard = () => {
  return (
    <div>
        <h1>this is dashboard component</h1>
        <Outlet />
    </div>
  )
}

export default DashBoard