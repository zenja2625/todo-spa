import { CSSProperties, useState } from 'react'
import {
    createCategoryThunk,
    deleteCategoryThunk,
    selectCategory,
    updateCategoryThunk,
} from '../slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { CategoryForm } from './tools/CategoryForm'
import Title from 'antd/lib/typography/Title'
import { Button, Col, List, Menu, Modal, Popover, Row } from 'antd'
import { useHistory, useParams } from 'react-router'
import { DashOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import confirm from 'antd/lib/modal/confirm'
import { Category } from '../slices/sliceTypes'
import { Form, Formik } from 'formik'
import { FormItem } from './utility/FormItem'

export const Categories = () => {
    const { push } = useHistory()
    const { categoryId } = useParams<{ categoryId?: string }>()

    const [popupMenuVisableId, setPopupMenuVisableId] = useState<number | null>(
        null
    )
    const [editModalVisable, setEditModalVisable] = useState(false)
    const [editModalId, setEditModalId] = useState<number | null>(null)

    const dispatch = useAppDispatch()
    const { categories, selectedCategoryId } = useAppSelector(state => ({
        ...state.categories,
    }))

    const Delete = (id: number) => {
        setPopupMenuVisableId(null)
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                dispatch(deleteCategoryThunk(id))
            },
        })
    }

    const Create = (value: string) => {
        dispatch(createCategoryThunk(value))
    }

    const Update = (value: Category) => {
        setPopupMenuVisableId(null)
        setEditModalVisable(true)
        setEditModalId(value.id)

        // const selectedCategoryId = categories.find(
        //     x => x.id.toString() === categoryId
        // )?.id
        // if (selectedCategoryId)
        //     dispatch(
        //         updateCategoryThunk({ id: selectedCategoryId, name: value })
        //     )
    }

    const popoverMenu = (category: Category) => {
        return (
            <Menu selectedKeys={[]} style={{ border: 0 }}>
                <Menu.Item onClick={() => Update(category)}>Изменить</Menu.Item>
                <Menu.Item onClick={() => Delete(category.id)}>
                    Удалить
                </Menu.Item>
            </Menu>
        )
    }

    const categoryItems = categories.map(item => {
        return (
            <Menu.Item
                className='menuItem'
                key={item.id}
                onClick={() => push(`/category/${item.id}`)}
            >
                <Row justify='space-between'>
                    <Col>{item.name}</Col>
                    <Col
                        onClick={event => event.stopPropagation()}
                        onMouseEnter={event => event.stopPropagation()}
                    >
                        <Popover
                            visible={
                                !!popupMenuVisableId &&
                                popupMenuVisableId === item.id
                            }
                            onVisibleChange={visable => {
                                if (visable) setPopupMenuVisableId(item.id)
                                else setPopupMenuVisableId(null)
                            }}
                            placement='bottom'
                            content={() => popoverMenu(item)}
                            trigger='click'
                        >
                            <Button type='text' style={{ height: '100%' }}>
                                <DashOutlined />
                            </Button>
                        </Popover>
                    </Col>
                </Row>
            </Menu.Item>
        )
    })

    return (
        <div style={{ margin: '15px' }}>
            <Title level={4}>Категории</Title>
            <Menu style={{ border: 0 }}>{categoryItems}</Menu>
            <Button type='primary' style={{ width: '100%', marginTop: '10px' }} onClick={() => setEditModalVisable(true)}>Новая категория</Button>
            <Formik
                initialValues={{ value: '' }}
                onSubmit={({ value }) => {
                    if (
                        editModalId &&
                        categories.find(x => x.id === editModalId)
                    )
                        dispatch(
                            updateCategoryThunk({
                                id: editModalId,
                                name: value,
                            })
                        )
                    else dispatch(createCategoryThunk(value))

                    setEditModalVisable(false)
                }}
            >
                {({ submitForm, setFieldValue, values }) => {
                    const value = categories.find(
                        x => x.id === editModalId
                    )?.name

                    if (value && !values.value) {
                        setFieldValue('value', value)
                    }

                    return (
                        <Modal
                            visible={editModalVisable}
                            onCancel={() => {
                                setEditModalVisable(false)
                            }}
                            onOk={() => submitForm()}
                            afterClose={() => {
                                setEditModalId(null)
                                setFieldValue('value', '')
                            }}
                            bodyStyle={{ width: '300px' }}
                        >
                            <Form>
                                <FormItem
                                    name='value'
                                    type='text'
                                    placeholder='Описание'
                                />
                            </Form>
                        </Modal>
                    )
                }}
            </Formik>
        </div>
    )
}
