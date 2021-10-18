import { useState } from 'react'
import {
    closeCategoryEditor,
    createCategoryThunk,
    deleteCategoryThunk,
    openCategoryEditor,
    updateCategoryThunk,
} from '../slices/categoriesSlice'
import { useAppDispatch, useAppSelector } from '../store'
import Title from 'antd/lib/typography/Title'
import { Button, Col, Menu, Popover, Row, Typography } from 'antd'
import { useHistory, useParams } from 'react-router'
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import confirm from 'antd/lib/modal/confirm'
import { Category } from '../slices/sliceTypes'
import { Formik } from 'formik'
import { FormItem } from './utility/FormItem'
import * as Yup from 'yup'
import { FormikModal } from './utility/EditableModal'
import { shallowEqual } from 'react-redux'

const CategorySchema = Yup.object().shape({
    value: Yup.string().required('Это поле обязательно'),
})

export const Categories = () => {
    const { push } = useHistory()
    const { categoryId } = useParams<{ categoryId?: string }>()

    const [popupMenuVisableId, setPopupMenuVisableId] = useState<number | null>(null)

    const dispatch = useAppDispatch()
    const categories = useAppSelector(state => state.categories.items)
    const { isOpen, value, editId } = useAppSelector(state => state.categories.editor)

    const openDeletePopup = (category: Category) => {
        setPopupMenuVisableId(null)
        confirm({
            title: (
                <>
                    Вы действительно хотите удалить{' '}
                    <Typography.Text strong>{category.name}</Typography.Text>?
                </>
            ),
            icon: <ExclamationCircleOutlined />,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            maskClosable: true,
            onOk: () => {
                dispatch(deleteCategoryThunk(category.id))
            },
        })
    }

    const popoverMenu = (category: Category) => {
        const { id, name } = category

        return (
            <Menu style={{ border: 0 }}>
                <Menu.Item
                    onClick={() => {
                        setPopupMenuVisableId(null)
                        dispatch(openCategoryEditor({ editId: id, value: name }))
                    }}
                >
                    Изменить
                </Menu.Item>
                <Menu.Item onClick={() => openDeletePopup(category)}>Удалить</Menu.Item>
            </Menu>
        )
    }

    const categoryItems = categories.map(item => {
        return (
            <Menu.Item
                className={'menuItem' + (categoryId !== item.id.toString() ? ' menuItemPopup' : '')}
                key={item.id}
                onClick={() => categoryId !== item.id.toString() && push(`/category/${item.id}`)}
            >
                <Row wrap={false} justify='space-between'>
                    <Col style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</Col>
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
                                <EllipsisOutlined />
                            </Button>
                        </Popover>
                    </Col>
                </Row>
            </Menu.Item>
        )
    })
//className='ant-menu-inline-collapsed'
    return (
        <div style={{ padding: '15px', overflow: 'hidden', width: '200px' }}>
            <Title level={4}>Категории</Title>
            <Menu  selectedKeys={categoryId ? [categoryId] : undefined} style={{ border: 0 }}>
                {categoryItems}
            </Menu>
            <Button
                type='primary'
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => dispatch(openCategoryEditor())}
            >
                Новая категория
            </Button>
            <Formik
                initialValues={{ value }}
                isInitialValid={() => CategorySchema.isValidSync({ value })}
                enableReinitialize
                validationSchema={CategorySchema}
                onSubmit={async values => {
                    if (editId) {
                        if (!shallowEqual(values, { value })) {
                            await dispatch(
                                updateCategoryThunk({
                                    id: editId,
                                    name: values.value,
                                })
                            )
                        }
                    } else await dispatch(createCategoryThunk(values.value))

                    dispatch(closeCategoryEditor())
                }}
            >
                <FormikModal
                    title={editId ? 'Изменить категорию' : 'Добавить новую категорию'}
                    visible={isOpen}
                    onCancel={() => dispatch(closeCategoryEditor())}
                    okText={editId ? 'Изменить' : 'Сохранить'}
                >
                    <FormItem name='value' type='text' placeholder='Название категории' autoFocus />
                </FormikModal>
            </Formik>
        </div>
    )
}
