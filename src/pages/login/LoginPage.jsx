import React from 'react'

const LoginPage = () => {
  return (
    <>
    <div>Sign in</div>
    <input type="text" placeholder='username'/>
    <input type="text" placeholder='password'/>
    <button>login</button>
    <label htmlFor="remember me">Remember me</label>
    <input type="checkbox" id='remember me'/>
    <a href="#">forget password</a>
    </>
  )
}

export default LoginPage