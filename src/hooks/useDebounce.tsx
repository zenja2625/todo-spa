import { useEffect, useState } from 'react'

export const useDebounce = <T,>(value: T, delayMS: number): [T, () => void] => {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
            console.log('useDebounce')
        }, delayMS)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delayMS])    

    const setValue = () => {
        setDebounceValue(value)
    }

    return [debounceValue, setValue]
}