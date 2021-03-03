import React from 'react'
import { ToDoList } from './Container/ToDoList'
import { SiteHeader } from './Container/header'
import { Layout } from 'antd'
import 'antd/dist/antd.css'
import { Route, Router, Switch, BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <SiteHeader />
        <div className='content' />
        <Route exact path="/"  >
          <ToDoList />
        </Route>
        <Route path="/login"  >
          <Login />
        </Route>
        <Route path="/register"  >
          <Register />
        </Route>
      </Layout>
    </BrowserRouter>
  );
}

const Login: React.FC = () => {
  return (
    <>
      Login
    </>
  )
}
const Register: React.FC = () => {
  return (
    <>
      Register
    </>
  )
}

export default App;
