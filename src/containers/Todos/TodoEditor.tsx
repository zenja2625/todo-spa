import { Modal, Form, Row, Col } from 'antd'
import { Formik } from 'formik'
import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router'
import { getEditTodoValue } from '../../selectors/getEditTodoValue'
import {
    updateTodoThunk,
    createTodoThunk,
    setTodoEditorState,
    updatePositionsThunk,
    updateStatusesThunk,
} from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { FormItem } from '../utility/FormItem'
import * as Yup from 'yup'
import { ITodosProps } from './types'

let renderCount = 1

const TodosSchema = Yup.object().shape({
    value: Yup.string().required('Это поле обязательно'),
    taskEnd: Yup.object().nullable().notRequired(),
})

export const TodoEditor: FC<ITodosProps> = ({ categoryId }) => {
    const editValue = useAppSelector(getEditTodoValue)
    const { editTodoId, isEditorOpen, prevTodoId, addBefore } = useAppSelector(
        state => state.todos.todoEditor
    )

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isEditorOpen) {
            dispatch(updateStatusesThunk(categoryId))
            dispatch(updatePositionsThunk(categoryId))
        }
    }, [isEditorOpen, dispatch])

    return (
        <div>
            <div>
                {document.getElementById('render') &&
                    createPortal(
                        <div>
                            <span>Todo Editor:</span> {renderCount++}
                        </div>,
                        document.getElementById('render') as HTMLElement
                    )}
            </div>
            <Formik
                validateOnMount
                initialValues={editValue}
                enableReinitialize
                validationSchema={TodosSchema}
                onSubmit={async ({ value, taskEnd }) => {
                    const selectedCategoryId = categoryId

                    if (editTodoId)
                        await dispatch(
                            updateTodoThunk({
                                id: editTodoId,
                                categoryId: selectedCategoryId,
                                todoDTO: {
                                    value: value,
                                    taskEnd: taskEnd?.toDate(),
                                },
                            })
                        )
                    else {
                        await dispatch(
                            createTodoThunk({
                                categoryId: selectedCategoryId,
                                todoValue: {
                                    value: value,
                                    taskEnd: taskEnd,
                                },
                                overTodoId: prevTodoId,
                                addBefore,
                            })
                        )
                    }

                    dispatch(setTodoEditorState({ isEditorOpen: false, editTodoId, value: { value: value } }))
                }}
            >
                {({ submitForm, isValid, validateForm, isSubmitting, resetForm }) => {
                    return (
                        <Modal
                            title={editTodoId ? 'Изменить задачу' : 'Добавить новую задачу'}
                            visible={isEditorOpen}
                            onCancel={() =>
                                dispatch(setTodoEditorState({ isEditorOpen: false, editTodoId, value: { value: '' } }))
                            }
                            afterClose={() => {
                                dispatch(setTodoEditorState({ isEditorOpen: false, value: { value: '' } }))
                                resetForm()
                                validateForm()
                            }}
                            onOk={() => submitForm()}
                            okText={editTodoId ? 'Изменить' : 'Сохранить'}
                            cancelText='Отмена'
                            destroyOnClose
                            confirmLoading={isSubmitting}
                            width={350}
                            bodyStyle={{ paddingBottom: 0 }}
                            okButtonProps={{ disabled: !isValid }}
                        >
                            <Form style={{ width: '100%' }}>
                                <Row gutter={10}>
                                    <Col span={14}>
                                        <FormItem
                                            name='value'
                                            type='text'
                                            placeholder='Название задачи'
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <FormItem
                                            name='taskEnd'
                                            type='datepicker'
                                            placeholder='Срок'
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    )
                }}
            </Formik>
        </div>
    )
}
