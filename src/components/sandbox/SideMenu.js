import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { Layout, Menu } from 'antd'
import iconList from '../../utils/mapIconToRouter'

const { Sider } = Layout

function SideMenu(props) {
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setItems(res.data)
    })
  }, [])

  // 渲染菜单
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if(item.children?.length && checkPagePermission(item)) {
        return (
          <Menu.SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            { renderMenu(item.children) }
          </Menu.SubMenu>
        )
      }else {
        return checkPagePermission(item) && (
          <Menu.Item 
            key={item.key} 
            icon={iconList[item.key]} 
            onClick={() => props.history.push(item.key)}
          >
            { item.title }
          </Menu.Item>
        )
      }
    })
  }
  const checkPagePermission = (item) => {
    return item.pagepermisson === 1 ? true : false
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div className="scroll" style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[props.location.pathname]}
            defaultOpenKeys={['/' + props.location.pathname.split('/')[1]]}
            selectedKeys={[props.location.pathname]}
          >
            { renderMenu(items) }
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
export default withRouter(SideMenu)