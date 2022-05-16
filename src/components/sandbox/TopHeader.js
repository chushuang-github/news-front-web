import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Header } = Layout

function TopHeader(props) {
  const user = JSON.parse(localStorage.getItem('token'))

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    props.history.replace('/login')
  }

  const menu = (
    <Menu>
      <Menu.Item>{user.role.roleName}</Menu.Item>
      <Menu.Item danger onClick={() => logout()}>退出登录</Menu.Item>
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
        <span style={{ marginRight: "10px" }}>
          欢迎<span style={{ color: '#1890ff', margin: '0 4px' }}>{user.username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size={30} icon={<UserOutlined />} />  
        </Dropdown>
      </div>
    </Header>
  )
}
export default withRouter(TopHeader)