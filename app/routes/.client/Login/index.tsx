import type { Route } from "./+types/index";
import styles  from './index.module.less'; // 
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input,message  } from 'antd';
import { http } from "@/utils/request";
import { useEffect, useState } from 'react';
import {userInfo} from '@/utils/userInfo'
import { useNavigate } from "react-router";
import { MyLocalStore } from '@/utils/store';
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "guyue" },
    { name: "description", content: "Login" },
  ];
}
export async function clientLoader({ params }: Route.ClientLoaderArgs) {

  const store = new MyLocalStore("user");
  

 
  const userInfos = {
    username:store.get("username"),
    password:store.get("password"),
    remember:store.get("remember"),
  }
  return userInfos;
}



export default function Login({
  loaderData,
}: Route.ComponentProps) {
  //const [messageApi, contextHolder] = message.useMessage();
  const { username, password,remember } = loaderData;
  let navigate = useNavigate();
  useEffect(()=>{
    //http.get("/test/t1")
    
    
  },[])


  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    if(values.remember){
      const store = new MyLocalStore("user");
      store.set('username',values.username)
      store.set('password',values.password)
      store.set('remember','true')
    }
    http.post("auth/login?code=0",{code:values.username,passwd:values.password}).then(res=>{
      if(res.code===200){
        userInfo.token = res.data;
        navigate("/");
        message.success('登录成功!');
      }
    })
    
    
  };
  return (<>
    <div className={styles['main-body']}>
      <div className={styles.color}></div>
      <div className={styles.color}></div>
      <div className={styles.color}></div>
      <div className={styles.box}>
        <div className={styles.circle} style={{ ['--x' as any]: 0 }}></div>
        <div className={styles.circle} style={{ ['--x' as any]: 1 }}></div>
        <div className={styles.circle} style={{ ['--x' as any]: 2 }}></div>
        <div className={styles.circle} style={{ ['--x' as any]: 3 }}></div>
        <div className={styles.circle} style={{ ['--x' as any]: 4 }}></div>
        <Form
      name="login"
      initialValues={{ username:username,password:password,remember: remember }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
      className={styles['login-form']}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入账号!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="请输入账号" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          <a href="">忘记密码</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          登   录
        </Button>
        or <a href="">注册!</a>
      </Form.Item>
    </Form>
      </div>
    </div>
  </>)
}