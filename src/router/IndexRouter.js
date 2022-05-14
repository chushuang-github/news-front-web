import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'

export default function IndexRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" render={() => {
        const token = localStorage.getItem('token')
        return token ? <NewsSandBox /> : <Redirect to='/login' />
      }} />
    </Switch>
  )
}
