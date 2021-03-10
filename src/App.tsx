import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { SiteHeader } from './Container/header'
import { Main } from './Container/Main'
import { Login } from './Container/login'
import { Register } from './Container/register'

function App() {
  return (
    <BrowserRouter>
        <SiteHeader />
        <main>
            <Route exact path="/"  >
              <Main />
            </Route>
            <Route path="/login"  >
              <Login />
            </Route>
            <Route path="/register"  >
              <Register />
            </Route>
        </main>
    </BrowserRouter>
  );
}

export default App;
