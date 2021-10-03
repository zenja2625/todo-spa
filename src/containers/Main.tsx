import { Layout } from 'antd'
import { Categories } from './Categories'
import { Todos } from './Todos/Todos'

const { Sider, Content } = Layout

export const Main = () => {
    return (
        <Layout>
            <Sider collapsible theme='light'>
                <Categories />
            </Sider>
            <Content>
                <Todos />
            </Content>
        </Layout>
    )
}
