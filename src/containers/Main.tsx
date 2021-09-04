import { useAppDispatch } from '../store'
import { Layout } from 'antd'
import { Categories } from './Categories'
import { Todos } from './Todos'

const { Sider, Content } = Layout

export const Main = () => {
    const dispatch = useAppDispatch()

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
