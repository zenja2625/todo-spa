import { Row, Col } from 'antd'
import { Formik } from 'formik'
import { FC, useEffect } from 'react'
import {
    updateTodoThunk,
    createTodoThunk,
    updatePositionsThunk,
    updateStatusesThunk,
    closeTodoEditor,
} from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { FormItem } from '../utility/FormItem'
import * as Yup from 'yup'
import { ITodosProps } from './types'
import { FormikModal } from '../utility/EditableModal'
import { shallowEqual } from 'react-redux'

const TodosSchema = Yup.object().shape({
    value: Yup.string().required('Это поле обязательно'),
    taskEnd: Yup.object().nullable().notRequired(),
})

export const TodoEditor: FC<ITodosProps> = ({ categoryId }) => {
    const {
        editId: editTodoId,
        isOpen: isEditorOpen,
        overId,
        addBefore,
        value: editValue,
    } = useAppSelector(state => state.todos.todoEditor)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isEditorOpen) {
            dispatch(updateStatusesThunk(categoryId))
            dispatch(updatePositionsThunk(categoryId))
        }
    }, [isEditorOpen, categoryId, dispatch])

    return (
        <Formik
            initialValues={editValue}
            isInitialValid={() => TodosSchema.isValidSync(editValue)}
            enableReinitialize
            validationSchema={TodosSchema}
            onSubmit={async values => {
                const selectedCategoryId = categoryId

                if (editTodoId) {
                    if (!shallowEqual(values, editValue)) {
                        await dispatch(
                            updateTodoThunk({
                                id: editTodoId,
                                categoryId: selectedCategoryId,
                                todoDTO: {
                                    value: values.value,
                                    taskEnd: values.taskEnd,
                                },
                            })
                        )
                    }
                } else {
                    await dispatch(
                        createTodoThunk({
                            categoryId: selectedCategoryId,
                            todoValue: {
                                value: values.value,
                                taskEnd: values.taskEnd,
                            },
                            overId,
                            addBefore,
                        })
                    )
                }

                dispatch(closeTodoEditor())
            }}
        >
            <FormikModal
                title={editTodoId ? 'Изменить задачу' : 'Добавить новую задачу'}
                visible={isEditorOpen}
                onCancel={() => dispatch(closeTodoEditor())}
                okText={editTodoId ? 'Изменить' : 'Сохранить'}
            >
                <Row gutter={10}>
                    <Col span={14}>
                        <FormItem
                            name='value'
                            type='text'
                            placeholder='Название задачи'
                            autoFocus
                        />
                    </Col>
                    <Col span={10}>
                        <FormItem name='taskEnd' type='datepicker' placeholder='Срок' />
                    </Col>
                </Row>
            </FormikModal>
        </Formik>
    )
}
