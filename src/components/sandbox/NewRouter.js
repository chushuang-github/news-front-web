import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import componentList from '../../utils/mapComponentToRouter'
import NoPermission from '../../views/sandbox/no-permission/NoPermission'

export default function NewRouter() {
  const [backRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])

  // 路由是否有展示的权限
  const checkRoute = (item) => {
    return componentList[item.key] && item.pagepermisson === 1
  }
  // 用户是否有展示该路由的权限
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }

  return (
    <Switch>
      {
        backRouteList.map(item => {
          if(checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                exact
                key={item.id}
                path={item.key} 
                component={componentList[item.key]}
              />
            )
          }
          return null
        })
      }
      <Redirect from="/" to="/home" exact />
      { backRouteList.length && <Route path="*" component={NoPermission} /> }
    </Switch>
  )
}
