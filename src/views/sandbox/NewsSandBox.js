import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from './no-permission/NoPermission'

import { Layout } from 'antd'
import './NewsSandBox.css'
const { Content } = Layout

export default function NewsSandBox() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout>
      <SideMenu collapsed={collapsed}></SideMenu>

      <Layout>
        <TopHeader 
          collapsed={collapsed} 
          toggle={() => setCollapsed(!collapsed)}
        ></TopHeader>
        <Content 
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: "#fff"
          }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />
            <Redirect from="/" to="/home" exact />
            <Route path="*" component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
