import { useEffect, useState } from 'react'

export const useDebounce = <T,>(value: T, delayMS: number) => {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delayMS)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delayMS])    

    return debounceValue
}