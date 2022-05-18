import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import News from '../views/news/News'
import Detail from '../views/news/Detail'

export default function IndexRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/news" component={News} />
      <Route path="/detail/:id" component={Detail} />
      <Route path="/" render={() => {
        const token = localStorage.getItem('token')
        return token ? <NewsSandBox /> : <Redirect to='/login' />
      }} />
    </Switch>
  )
}
