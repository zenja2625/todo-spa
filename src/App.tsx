import { Layout, Spin } from 'antd'
import { useEffect } from 'react'
import { Login } from './containers/account/Login'
import { Register } from './containers/account/Register'
import { useAppDispatch, useAppSelector } from './store'
import './momentLocale'

// import 'antd/dist/antd.css'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AppHeader } from './containers/AppHeader'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'
import { initializeApp } from './slices/appSlice'
import { RedirectWithCurrentLocation } from './containers/utility/RedirectWithCurrentLocation'

const App = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const initialized = useAppSelector(state => state.app.initialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!initialized) dispatch(initializeApp())
    }, [initialized, dispatch])

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
                <Route path='/category/:categoryId' >
                    {isAuth ? <Main /> : <RedirectWithCurrentLocation to='/login' />}
                </Route>
                <Route path='/login'>
                    {isAuth ? <Redirect to='/' /> : <Login />}
                </Route>
                <Route path='/register' >
                    {isAuth ? <Redirect to='/' /> : <Register />}
                </Route>
                <Route>
                    <NotFoundPage />
                </Route>
            </Switch>
        </Layout>
    )
}

export default App
