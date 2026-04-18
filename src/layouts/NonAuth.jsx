import React from 'react'
import { Outlet } from 'react-router-dom'

const NonAuth = () => {
  return (
    <div>this is non Auth component
        <Outlet />
    </div>
  )
}

export default NonAuth