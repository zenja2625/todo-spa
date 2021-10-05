import { useState } from 'react'
import {
    createCategoryThunk,
    deleteCategoryThunk,
    updateCategoryThunk,
} from '../slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store'
import Title from 'antd/lib/typography/Title'
import { Button, Col, Menu, Modal, Popover, Row } from 'antd'
import { useHistory, useParams } from 'react-router'
import { DashOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import confirm from 'antd/lib/modal/confirm'
import { Category } from '../slices/sliceTypes'
import { Form, Formik } from 'formik'
import { FormItem } from './utility/FormItem'
import * as Yup from 'yup'
import { createPortal } from 'react-dom'

let renderCount = 1

const initialValue = {
    value: '',
}

const CategorySchema = Yup.object().shape({
    value: Yup.string().required('Это поле обязательно'),
})

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
    const { categoryId } = useParams<{ categoryId?: string }>()

    const [popupMenuVisableId, setPopupMenuVisableId] = useState<number | null>(null)
    const [editModalVisable, setEditModalVisable] = useState(false)
    const [editModalId, setEditModalId] = useState<number | null>(null)
    const [editModalValue, setEditModalValue] = useState<{ value: string }>(initialValue)

    const dispatch = useAppDispatch()
    const categories = useAppSelector(state => state.categories.categories)

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
                className={
                    'menuItem' +
                    (popupMenuVisableId === item.id && categoryId !== item.id.toString()
                        ? ' menuItemPopup'
                        : '')
                }
                key={item.id}
                onClick={() => categoryId !== item.id.toString() && push(`/category/${item.id}`)}
            >
                <Row justify='space-between'>
                    <Col>{item.name}</Col>
                    <Col onClick={event => event.stopPropagation()}>
                        <Popover
                            destroyTooltipOnHide={{ keepParent: false }}
                            visible={popupMenuVisableId === item.id}
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
            {document.getElementById('render') &&
                createPortal(
                    <div>
                        <span>Categories:</span> {renderCount++}
                    </div>,
                    document.getElementById('render') as HTMLElement
                )}
            <Title level={4}>Категории</Title>
            <Menu selectedKeys={categoryId ? [categoryId] : undefined} style={{ border: 0 }}>
                {categoryItems}
            </Menu>
            <Button
                type='primary'
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => openEditor()}
            >
                Новая категория
            </Button>
            <Formik
                validateOnMount
                initialValues={editModalValue}
                enableReinitialize
                validationSchema={CategorySchema}
                onSubmit={async ({ value }) => {
                    if (editModalId && categories.find(x => x.id === editModalId))
                        await dispatch(
                            updateCategoryThunk({
                                id: editModalId,
                                name: value,
                            })
                        )
                    else await dispatch(createCategoryThunk(value))

                    setEditModalVisable(false)
                }}
            >
                {({ submitForm, isValid, validateForm, resetForm }) => {
                    return (
                        <Modal
                            title={editModalId ? 'Изменить категорию' : 'Добавить новую категорию'}
                            visible={editModalVisable}
                            onCancel={() => setEditModalVisable(false)}
                            afterClose={() => {
                                setEditModalValue(initialValue)
                                resetForm()
                                validateForm()
                            }}
                            onOk={() => submitForm()}
                            okText={editModalId ? 'Изменить' : 'Сохранить'}
                            cancelText='Отмена'
                            destroyOnClose
                            width={300}
                            bodyStyle={{ paddingBottom: 0 }}
                            okButtonProps={{ disabled: !isValid }}
                        >
                            <Row>
                                <Form style={{ width: '100%' }}>
                                    <FormItem
                                        name='value'
                                        type='text'
                                        placeholder='Название категории'
                                    />
                                </Form>
                            </Row>
                        </Modal>
                    )
                }}
            </Formik>
        </div>
    )
}
