import { useState, FC } from 'react'
import { Button, Row, Col, Menu, Layout } from 'antd'
import 'antd/dist/antd.css'
import '../App.css'


const { Header } = Layout

export const SiteHeader: FC = () => {
    const [val, setVal] = useState(0)
    
    return (
        <Header className='header'>
            <div className='logo'>My To Do</div>
            <Menu className='menu' theme='dark' mode='horizontal'>
                <Menu.Item key='1'>Login</Menu.Item>
                <Menu.Item key='2'>Register</Menu.Item>
            </Menu>
        </Header>
    )
    
}

//<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']
//className="logo" 