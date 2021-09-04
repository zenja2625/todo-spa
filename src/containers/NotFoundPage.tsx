import { Result, Button, Row } from 'antd'
import { useHistory } from 'react-router'

export const NotFoundPage = () => {
    const { push } = useHistory()


    return (
        <Row justify='center' align='middle' style={{ height: '100%' }}>
            <Result
                status='404'
                title='404'
                subTitle='Данной страницы не существует.'
                extra={
                    <Button type='primary' onClick={() => push('/')}>
                        На главную страницу
                    </Button>
                }
            />
        </Row>
    )
}
