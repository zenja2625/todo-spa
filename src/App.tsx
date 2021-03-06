import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { SiteHeader } from './Container/header'
import { ToDoList } from './Container/ToDoList'

function App() {
  return (
    <BrowserRouter>
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
