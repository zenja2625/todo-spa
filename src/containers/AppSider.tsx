import { Drawer, Layout } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { toggleSider } from '../slices/appSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Categories } from './Categories'
const { Sider } = Layout

export const AppSider = () => {
    const { lg } = useBreakpoint()

    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    return (
        <>
            {lg ? (
                <Sider
                    width='200px'
                    trigger={null}
                    theme='light'
                    className={
                        siderCollapsed
                            ? 'ant-layout-sider-zero-width ant-layout-sider-collapsed collapse-sider'
                            : 'ant-layout-sider-zero-width'
                    }
                >
                    <Categories />
                </Sider>
            ) : (
                <Drawer
                    visible={!siderCollapsed}
                    onClose={() => dispatch(toggleSider())}
                    width='200px'
                    destroyOnClose
                    closable={false}
                    placement='left'
                    bodyStyle={{ padding: 0 }}
                    style={{ top: '64px' }}
                >
                    <Categories />
                </Drawer>
            )}
        </>
    )
}
