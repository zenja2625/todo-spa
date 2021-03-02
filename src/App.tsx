import React from 'react'
import { ToDoList } from './Container/ToDoList'
import { SiteHeader } from './Container/header'
import { Layout } from 'antd'
import 'antd/dist/antd.css'

function App() {
  return (
    <Layout>
        <SiteHeader />
        <div  className='content'/>
        <ToDoList />
    </Layout>
  );
}

export default App;
