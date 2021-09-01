import { Row, Col, Menu, Layout } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../store'

const { Header } = Layout

export const AppHeader = () => {
    const { push } = useHistory()
    const { pathname } = useLocation()

    const { isAuth, username } = useAppSelector(state => state.account)
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
                    {
                        isAuth ?
                            (
                                <Row justify='end' wrap={false} gutter={10}>
                                    <Col>
                                        {username}
                                    </Col>
                                    <Col>
                                        <Menu
                                            theme="dark"
                                            mode="horizontal"
                                            style={{ width: '85px' }}
                                        >
                                            <Menu.Item style={{ width: '85px', textAlign: 'center' }} onClick={logout}>Выход</Menu.Item>
                                        </Menu>
                                    </Col>
                                </Row>
                            ) :
                            (
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    selectedKeys={[pathname]}
                                    style={{ justifyContent: 'end' }}
                                >
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
                                </Menu>
                            )
                    }
                    {/* <Row justify='end' wrap={false}>
                        <Col>{username}</Col>
                        <Col flex='auto'>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[pathname]}
                                style={{  }}
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
                    </Row> */}
                </Col>
            </Row>
        </Header>
    )
}

/* */
