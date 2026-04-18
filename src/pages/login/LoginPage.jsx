import React from 'react'
import { Layout, Space, Card,Button, Checkbox, Form, Input, Flex, Alert} from 'antd';
import { LockFilled ,LockOutlined,UserOutlined} from '@ant-design/icons';
import logo from "../../assets/Mern Space Admin Logo.svg"
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, logout, self } from '../../http/api.js';
import { useAuthStore } from '../../store.js';

const loginUser = async (credentials)=>{
  const {data} = await login(credentials)
  return data;
}

const getSelf = async()=>{
  const {data} = await self()
  return data;
}
const LoginPage = () => {

  const {setUser , logout:logoutFromStore} = useAuthStore()

  const {data: selfData, refetch} = useQuery({
    queryKey:['self'],
    queryFn:getSelf,
    enabled: false // Don't run on mount, only after login
  })

  const {mutate,isPending,isError,error} = useMutation(
    { 
      mutationKey:['login'],
      mutationFn :loginUser,
      onSuccess:async ()=>{
        const promiseData = await refetch()

        if(promiseData.data.role==="customer")
        {
            await logout();
            logoutFromStore();
        }
        setUser(promiseData.data)
        console.log("Logged in user:", promiseData.data)
      }
    }
  )
 
  return (
    <>

    <Layout style={{height:'100vh', display:'grid',placeItems:'center'}}>
      <Space vertical align='center'>
      <Layout.Content style={{display:"flex", justifyContent:'center', alignItems:'center'}}>
      <img src={logo} alt="logo" />
    </Layout.Content>
     
   
    <Card title={
      <Space style={{width:'100%',fontSize:16,justifyContent:'center'}}>
      <LockFilled/> Sign in
      </Space>
      } 
      variant="borderless" 
      style={{ width: 300 }}>

      {/* form starts here */}

    <Form
    name="basic"
    style={{ maxWidth: 600 }}
    autoComplete="off"
      onFinish={(userData)=>{
        mutate({email:userData.username,password:userData.password})
        //console.log(userData)
      }}
  >
      {isError &&  <Alert title={error?.message} type="error" />}
     <Form.Item
      name="username"
      rules={[{ required: true, message: 'Please enter your username!' }]}
    >
      <Input prefix={<UserOutlined />} type={"text"} placeholder='username'/>
    </Form.Item>

    <Form.Item   
      name="password"
      rules={[{ required: true, message: 'Please enter your password!' }]}
    >
      <Input.Password  prefix={<LockOutlined />} type={"password"} placeholder='password'/>
    </Form.Item>

    <Flex justify='space-between'>
    <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox>Remember me</Checkbox>  
    </Form.Item>
    <a href="#" id='login-form-forget-password'>Forget password</a>
    </Flex>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit" style={{width:'100%'}} loading={isPending}>
        login
      </Button>
      </Form.Item>

     </Form>

    </Card>
    </Space>
    </Layout>
    
    </>
  )
}

export default LoginPage