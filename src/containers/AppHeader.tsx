import { Row, Col, Menu, Layout, Tooltip } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import Title from 'antd/lib/typography/Title'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'

const { Header } = Layout
const antIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: 'white' }} spin />
)

export const AppHeader = () => {
    const { xs } = useBreakpoint()

    const { push } = useHistory()
    const { pathname } = useLocation()

    const { isAuth, username } = useAppSelector(state => state.account)
    const isRequest = useAppSelector(state => state.app.requestCount > 0)
    const dispatch = useAppDispatch()

    const logout = () => {
        dispatch(logoutThunk())
    }

    return (
        <Header className={'header'}>
            <Row
                style={{ height: '64px' }}
                justify='space-between'
                align='middle'
                wrap={false}
            >
                <Col>
                    <Row align='middle' gutter={xs ? 10 : 20}>
                        <Col>
                            <Link to='/'>
                                <Title
                                    style={{
                                        color: 'white',
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                    }}
                                    level={xs ? 4 : 2}
                                >
                                    My Todo
                                </Title>
                            </Link>
                        </Col>
                        <Col>
                            <Spin
                                indicator={antIcon}
                                delay={500}
                                spinning={isRequest}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col flex='auto'>
                    {isAuth ? (
                        <Row justify='end' wrap={false} gutter={10}>
                            <Col>
                                <Tooltip title={username}>
                                    <Avatar
                                        style={{
                                            backgroundColor: 'orangered',
                                            verticalAlign: 'middle',
                                            userSelect: 'none',
                                        }}
                                        size='large'
                                    >
                                        {username[0].toUpperCase()}
                                    </Avatar>{' '}
                                </Tooltip>
                            </Col>
                            <Col>
                                <Menu
                                    theme='dark'
                                    mode='horizontal'
                                    style={{ width: '85px', height: '64px' }}
                                >
                                    <Menu.Item
                                        key='logout'
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
                            theme='dark'
                            mode='horizontal'
                            selectedKeys={[pathname]}
                            style={{ justifyContent: 'end', height: '64px' }}
                        >
                            <Menu.Item
                                key='/login'
                                onClick={() => push('/login')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                Вход
                            </Menu.Item>
                            <Menu.Item
                                key='/register'
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
