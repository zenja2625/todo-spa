import { Layout, Space, Spin, Typography } from 'antd'
import { useEffect } from 'react'
import { Login } from './containers/account/Login'
import { Register } from './containers/account/Register'
import { useAppDispatch, useAppSelector } from './store'
import './momentLocale'

import 'antd/dist/antd.css'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AppHeader } from './containers/AppHeader'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'
import { initializeApp } from './slices/appSlice'

const App = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const initialized = useAppSelector(state => state.app.initialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!initialized) dispatch(initializeApp())
    }, [initialized, dispatch])

    //////


    //////

    if (!initialized)
        return (
            <Spin
                tip='Загрузка...'
                size='large'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100vh',
                }}
            ></Spin>
        )

    return (
        <Layout style={{ height: '100vh' }}>
            <AppHeader />
            <Switch>
                <Route exact path='/'>
                    {isAuth ? <Main /> : <Redirect to='/login' />}
                </Route>
                <Route path='/category/:categoryId'>
                    {isAuth ? <Main /> : <Redirect to='/login' />}
                </Route>
                <Route path='/login'>
                    {isAuth ? <Redirect to='/' /> : <Login />}
                </Route>
                <Route path='/register'>
                    {isAuth ? <Redirect to='/' /> : <Register />}
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>

            {
                ////////////////////
                <Space
                    id='render'
                    direction='vertical'
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 10000,
                        backgroundColor: '#001529',
                        color: 'white',
                        width: '200px',
                        padding: '10px'
                    }}
                >
                    <Typography.Title style={{ color: 'white' }} level={4}>Render</Typography.Title>
                </Space>
                ////////////////////
            }
        </Layout>
    )
}

export default App
