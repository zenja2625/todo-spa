import React, { FC, useEffect, useState } from 'react'


type CategoryFormType = {
    buttonValue: string,
    textValue?: string,
    method: (value: string) => void
}

export const CategoryForm: FC<CategoryFormType> = ({ buttonValue, textValue, method }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(textValue || '')
    }, [textValue])

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        method(value)
    }

    return (
        <form onSubmit={submit}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
            <input type="submit" value={buttonValue} disabled={!value}/>
        </form>
    )
}