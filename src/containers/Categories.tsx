import { CSSProperties, useCallback, useEffect, useState } from 'react'
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
import useModal from 'antd/lib/modal/useModal'
import { Category } from '../slices/sliceTypes'
import { Form, Formik } from 'formik'
import { FormItem } from './utility/FormItem'
import { createTodoThunk } from '../slices/todosSlice'

const initialValue = {
    value: ''
}

const useModalEditorControl = <TValue, TData>(
    initialValue: TValue,
    onSubmit: (value: TValue, data?: TData) => void
) => {
    const [editModalVisable, setEditModalVisable] = useState(false)
    const [editModalData, setEditModalData] = useState<TData | null>(null)
    const [editModalValue, setEditModalValue] = useState<TValue>(initialValue)

    const open = (value?: TValue, data?: TData) => {
        setEditModalVisable(true)
        setEditModalData(data || null)
        setEditModalValue(value || initialValue)
    }

    const close = () => {
        setEditModalVisable(true)
        setEditModalData(null)
        setEditModalValue(initialValue)
    }

    return { open, close, isOpen: editModalVisable, editValue: editModalValue }
}

export const Categories = () => {
    const { push } = useHistory()

    const [popupMenuVisableId, setPopupMenuVisableId] = useState<number | null>(
        null
    )
    const [editModalVisable, setEditModalVisable] = useState(false)
    const [editModalId, setEditModalId] = useState<number | null>(null)
    const [editModalValue, setEditModalValue] = useState<{ value: string }>(initialValue)

    const [updater, setUpdater] = useState(false)

    const dispatch = useAppDispatch()
    const categories = useAppSelector(state =>
        state.categories.categories
    )

    const openDeletePopup = (id: number) => {
        setPopupMenuVisableId(null)
        confirm({
            title: 'Are you sure delete this category?',
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

    const openEditor = (value?: Category) => {
        setPopupMenuVisableId(null)

        setEditModalVisable(true)
        setEditModalId(value ? value.id : null)
        setEditModalValue(value ? { value: value.name } : initialValue)
    }

    const popoverMenu = (category: Category) => {
        return (
            <Menu selectedKeys={[]} style={{ border: 0 }}>
                <Menu.Item onClick={() => openEditor(category)}>Изменить</Menu.Item>
                <Menu.Item onClick={() => openDeletePopup(category.id)}>Удалить</Menu.Item>
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
            {console.log('Category Render')}
            <Title level={4}>Категории</Title>
            <Menu style={{ border: 0 }}>{categoryItems}</Menu>
            <Button type='primary' style={{ width: '100%', marginTop: '10px' }} onClick={() => openEditor()}>Новая категория</Button>
            <Formik
                initialValues={editModalValue}
                enableReinitialize
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
                {({ submitForm, resetForm }) => {
                    console.log('Formik Render')

                    return (
                        <Modal
                            title={editModalId ? 'Изменить категорию' : 'Добавить новую категорию'}
                            visible={editModalVisable}
                            onCancel={() => setEditModalVisable(false)}
                            afterClose={() => resetForm()}
                            onOk={() => submitForm()}
                            okText={editModalId ? 'Изменить' : 'Сохранить'}
                            cancelText='Отмена'
                            bodyStyle={{ width: '300px' }}
                            destroyOnClose
                        >
                            <Form>
                                <FormItem
                                    name='value'
                                    type='text'
                                    placeholder='Описание'
                                />
                                <Button onClick={() => setUpdater(prev => !prev)}>Update</Button>
                            </Form>
                        </Modal>
                    )
                }}
            </Formik>
        </div>
    )
}
