import { TreeItem } from '../types'

export const getItemChildCount = <T extends TreeItem>(items: Array<T>, index: number) => {
    let count = 0
    for (let i = index + 1; i < items.length && items[index].depth < items[i].depth; i++)
        count++

    return count
}