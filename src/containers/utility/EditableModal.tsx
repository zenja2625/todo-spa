import { Modal, ModalProps } from "antd"
import { useFormikContext } from "formik"
import { FC, PropsWithChildren, useCallback, useEffect } from "react"


interface EditableModalProps<T> extends ModalProps {
    onModalOpen?: () => void
    data?: T
}


export const EditableModal = <T,>({ children, onModalOpen, data, ...props }: PropsWithChildren<EditableModalProps<T>>) => {
    const { setValues } = useFormikContext<T>()

    useEffect(() => {
        if (data)
            setValues(data)
    }, [data])

    // useEffect(() => {
    //     if (props.visible && data)
    //         setValues(data)
    //     console.log('EditableModal Render')
    // }, [props.visible])

    return (
        <Modal
            {...props}
        >
            {children}
        </Modal>
    )
}