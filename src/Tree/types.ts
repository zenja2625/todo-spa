import { Todo } from '../slices/sliceTypes'

export type TreeItem = {
    id: string
    depth: number
    isOpen: boolean
}

export type TreeProps = {
    items: Array<Todo>
    setItems: React.Dispatch<React.SetStateAction<TreeItem[]>>
    itemHeight: number
    gap: number
    maxDepth: number
    depthWidth: number
    header: JSX.Element
    footer: JSX.Element
}

export type ItemProps = {
    dragStart?: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void
    toggle?: (id: string) => void
} & TreeItem

export type RowData = {
    items: Array<TreeItem>
    order: Array<TreeItem>
    add: (id: string, element: HTMLDivElement) => void
    remove: (id: string) => void
    events: {
        dragStart: (id: string) => void
        close: (id: string) => void
    }
}
export type ElementDictionary = { [key: string]: HTMLDivElement }

export type OverlayProps = {
    style: React.CSSProperties

    initialCoors: Coors

    itemHeight: number
    itemWidth: number

    // shift: Coors
    children?: React.ReactNode
}

export type ListElement = {
    value: HTMLElement
    index: number
}

export type Coors = {
    x: number
    y: number
}
