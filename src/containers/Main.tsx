import { Layout } from 'antd'
import { useAppSelector } from '../store'
import { Categories } from './Categories'
import { Todos } from './Todos/Todos'

const { Sider, Content } = Layout

export const Main = () => {
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    return (
        <Layout>
            <Sider
                width='200px'
                trigger={null}
                theme='light'
                className={siderCollapsed ? 'ant-layout-sider-zero-width ant-layout-sider-collapsed collapse-sider' : 'ant-layout-sider-zero-width'}
            >
                <Categories />
            </Sider>
            <Content>
                <Todos />
            </Content>
        </Layout>
    )
}
