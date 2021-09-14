import { Layout } from 'antd'
import { useEffect } from 'react'
import { Login } from './containers/account/Login'
import { Register } from './containers/account/Register'
import { userInfoThunk } from './slices/accountSlice'
import { clearCategories, getCategoriesThunk } from './slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from './store'
import './momentLocale'

import 'antd/dist/antd.css'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AppHeader } from './containers/AppHeader'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'

const App = () => {
    const { isAuth } = useAppSelector(state => state.account)
    const initialized = useAppSelector(state => state.app.initialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const initializeApp = async () => {
            dispatch(userInfoThunk())
        }
        
        initializeApp()
    }, [dispatch])

    useEffect(() => {
        if (isAuth) dispatch(getCategoriesThunk())
        else dispatch(clearCategories())
    }, [isAuth, dispatch])

    // if (!initialized)
    //     return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузака...</div>

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
        </Layout>
    )
}

export default App
