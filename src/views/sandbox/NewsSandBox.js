import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewRouter from '../../components/sandbox/NewRouter'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import { Layout } from 'antd'
import './NewsSandBox.css'
const { Content } = Layout

export default function NewsSandBox() {
  // 进度条开始
  Nprogress.start()
  // useEffect执行时，dom元素已经加载成功，进度条结束
  useEffect(() => {
    Nprogress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader />
        <Content 
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: "#fff",
            overflow: "auto"
          }}
        >
          <NewRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
