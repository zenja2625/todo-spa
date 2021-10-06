import { Modal, ModalProps } from "antd"
import { useFormikContext, Form } from "formik"
import { FC } from "react"

export const FormikModal: FC<ModalProps> = ({ children, ...props }) => {
    const { submitForm, isValid, isSubmitting, resetForm } = useFormikContext()

    return (
        <Modal
            afterClose={() => {
                resetForm()
            }}
            onOk={() => submitForm()}
            cancelText='Отмена'
            destroyOnClose
            confirmLoading={isSubmitting}
            width={350}
            bodyStyle={{ paddingBottom: 0 }}
            okButtonProps={{ disabled: !isValid }}
            {...props}
        >
            <Form style={{ width: '100%' }} onKeyDown={e => e.key === 'Enter' && submitForm()}>
                {children}
            </Form>
        </Modal>
    )
}