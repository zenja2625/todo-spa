import { Modal, Form, Row, Col } from 'antd'
import { Formik } from 'formik'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router'
import { getEditTodoValue } from '../../selectors/getEditTodoValue'
import { updateTodoThunk, createTodoThunk, setTodoEditorState } from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { FormItem } from '../utility/FormItem'

let renderCount = 1

export const TodoEditor = () => {
    const { categoryId } = useParams<{ categoryId?: string }>()

    const editValue = useAppSelector(getEditTodoValue)
    const { editTodoId, isEditorOpen, prevTodoId, addBefore } = useAppSelector(state => state.todos.todoEditor)

    const dispatch = useAppDispatch()

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
                // validationSchema={CategorySchema}
                onSubmit={({ value, taskEnd }) => {
                    const selectedCategoryId = Number(categoryId)

                    if (editTodoId)
                        dispatch(
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
                        dispatch(
                            createTodoThunk({
                                categoryId: selectedCategoryId,
                                todoValue: {
                                    value: value,
                                    taskEnd: taskEnd
                                },
                                prevTodoId: prevTodoId,
                                addBefore
                            })
                        )
                    }

                    dispatch(setTodoEditorState({ isEditorOpen: false }))
                }}
            >
                {({ submitForm, resetForm, isValid }) => {
                    return (
                        <Modal
                            title={
                                editTodoId
                                    ? 'Изменить задачу'
                                    : 'Добавить новую задачу'
                            }
                            visible={isEditorOpen}
                            onCancel={() => dispatch(setTodoEditorState({ isEditorOpen: false }))}
                            afterClose={() => resetForm()}
                            onOk={() => submitForm()}
                            okText={editTodoId ? 'Изменить' : 'Сохранить'}
                            cancelText='Отмена'
                            destroyOnClose
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
