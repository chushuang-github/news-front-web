import React from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Header } = Layout

export default function TopHeader(props) {
  const menu = (
    <Menu>
      <Menu.Item>超级管理员</Menu.Item>
      <Menu.Item danger>退出登录</Menu.Item>
    </Menu>
  )
  return (
    <Header style={{ padding: 0, background: "#fff" }}>
      {React.createElement(
        props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: props.toggle
      })}
      <div style={{ float: "right", marginRight: "25px" }}>
        <span style={{ marginRight: "10px" }}>欢迎admin回来</span>
        <Dropdown overlay={menu}>
          <Avatar size={30} icon={<UserOutlined />} />  
        </Dropdown>
      </div>
    </Header>
  )
}
