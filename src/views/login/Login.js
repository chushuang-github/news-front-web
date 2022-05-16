import React from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from "react-tsparticles"
import { loadFull } from 'tsparticles'
import './Login.css'

export default function Login(props) {
  const onFinish = (value) => {
    const { username, password } = value
    const url = `/users?username=${username}&password=${password}&roleState=${true}&_expand=role`
    axios.get(url).then(res => {
      if(res.data.length === 0) {
        message.error("用户名或者密码错误")
      }else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.replace('/')
      }
    })
  }
  const particlesLoaded = (container) => {
    // console.log(container)
  }
  const particlesInit = async (main) => {
    await loadFull(main)
  }
  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: '100vh' }}>
      <Particles 
        id="tsparticles" 
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              // onHover: {
              //   enable: true,
              //   mode: "repulse",
              // },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4
              }
            }
          },
          // 粒子的参数
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            }
          },
          detectRetina: true,
        }}
      />
      <div className='login-content'>
        <div className='login-title'>全球新闻发布系统</div>
        <Form
          name="normal_login"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='login-button'>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
