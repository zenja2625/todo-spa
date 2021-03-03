import React, { FC } from 'react'
import { Menu, Layout } from 'antd'
import 'antd/dist/antd.css'
import '../App.css'
import { Link } from 'react-router-dom'


const { Header } = Layout

export const SiteHeader: FC = () => {

    return (
        <Header className='header'>
            <div className='logo'><Link to='/'>My To Do</Link></div>
            <Menu className='menu' theme='dark' mode='horizontal'>
                <Menu.Item key='1'><Link to='/login'>Login</Link></Menu.Item>
                <Menu.Item key='2'><Link to='/register'>Register</Link></Menu.Item>
            </Menu>
        </Header>
    )
    
}

//<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']
//className="logo" 