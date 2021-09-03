import { Row, Col, Menu, Layout } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
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
        <Header className={'header'}>
            <Row
                style={{ height: '64px' }}
                justify="space-between"
                align="middle"
                wrap={false}
            >
                <Col>
                    <Link to="/">
                        <Title
                            style={{
                                color: 'white',
                                margin: 0,
                                whiteSpace: 'nowrap',
                            }}
                            level={2}
                        >
                            My Todo
                        </Title>
                    </Link>
                </Col>
                <Col flex="auto">
                    {isAuth ? (
                        <Row justify="end" wrap={false} gutter={10}>
                            <Col>
                                <Avatar
                                    style={{
                                        backgroundColor: 'orangered',
                                        verticalAlign: 'middle',
                                        userSelect: 'none',
                                    }}
                                    size="large"
                                >
                                    {username[0].toUpperCase()}
                                </Avatar>
                            </Col>
                            <Col>
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    style={{ width: '85px', height: '64px' }}
                                >
                                    <Menu.Item
                                        key="logout"
                                        style={{
                                            width: '85px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onClick={logout}
                                    >
                                        Выход
                                    </Menu.Item>
                                </Menu>
                            </Col>
                        </Row>
                    ) : (
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={[pathname]}
                            style={{ justifyContent: 'end', height: '64px' }}
                        >
                            <Menu.Item
                                key="/login"
                                onClick={() => push('/login')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Вход
                            </Menu.Item>
                            <Menu.Item
                                key="/register"
                                onClick={() => push('/register')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Регистрация
                            </Menu.Item>
                        </Menu>
                    )}
                </Col>
            </Row>
        </Header>
    )
}

/* */
