import { Layout } from 'antd'
import { AppSider } from './AppSider'
import { Todos } from './Todos/Todos'

const { Content } = Layout

export const Main = () => {
    return (
        <Layout>
            <AppSider />
            <Content>
                <Todos />
            </Content>
        </Layout>
    )
}
