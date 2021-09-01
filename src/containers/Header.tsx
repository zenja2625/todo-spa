import { Row, Col, Menu, Layout } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../store'

const { Header } = Layout

export const AppHeader = () => {
    const { push } = useHistory()
    const { pathname } = useLocation()

    const isAuth = useAppSelector(state => state.account.isAuth)
    const dispatch = useAppDispatch()

    const logout = () => {
        dispatch(logoutThunk())
    }

    return (
        <Header>
            <Row
                style={{ height: '64px' }}
                justify="space-between"
                align="middle"
                wrap={false}
            >
                <Col>
                    <Link to="/">
                        <Title style={{ color: 'white', margin: 0, whiteSpace: 'nowrap' }} level={2}>
                            My Todo
                        </Title>
                    </Link>
                </Col>
                <Col flex='auto'>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={[pathname]}
                            style={{ display: 'flex', justifyContent: 'end' }}
                        >
                            {isAuth ? (
                                <>
                                    <Menu.Item key="asdasd" onClick={logout}>
                                        Выход
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.Item
                                        key="/login"
                                        onClick={() => push('/login')}
                                    >
                                        Вход
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/register"
                                        onClick={() => push('/register')}
                                    >
                                        Регистрация
                                    </Menu.Item>
                                </>
                            )}
                        </Menu>
                </Col>
            </Row>
        </Header>
    )
}

/* */
