import { message } from 'antd'
import { useEffect } from 'react'
import { Login } from './containers/account/Login'
import { Register } from './containers/account/Register'
import { Categories } from './containers/Categories'
import { Todos } from './containers/Todos'
import { logoutThunk, userInfoThunk } from './slices/accountSlice'
import { clearCategories, getCategoriesThunk } from './slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from './store'
import { SyncOutlined } from '@ant-design/icons'


import 'antd/dist/antd.css'
import { toggleLoadingStatus } from './slices/appSlice'

const App = () => {
  const { requestCount } = useAppSelector(state => state.app)
  const account = useAppSelector(state => state.account)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(userInfoThunk())
  }, [dispatch])
  
  useEffect(() => {
    if (account.isAuth)
      dispatch(getCategoriesThunk())
    else
      dispatch(clearCategories())
  }, [account.isAuth, dispatch])

  const divStyle: React.CSSProperties = {display: 'flex'}

  return (
    <div>
        <div style={divStyle}>
          <div style={{marginRight: '30px'}}>Username: {account.username}</div>
          <input type="button" value='Logout' onClick={() => dispatch(logoutThunk())}/>
          <input type="button" value="Error" onClick={() => message.error('Error')}/>
          <input type="button" value="Toggle Loading" onClick={() => dispatch(toggleLoadingStatus())}/>
          <SyncOutlined style={{fontSize: '30px'}} spin={!!requestCount}/>
        </div>
        <div style={divStyle}>
          <Login />
          <span style={{marginRight: '60px'}}></span>
          <Register />
        </div>
        <div style={divStyle}>
          <Categories />
          <span style={{marginRight: '60px'}}></span>
          <Todos />
        </div>
    </div>
  )
}

export default App;
