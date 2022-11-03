export type Coors = {
    x: number
    y: number
}

export type TreeItem = {
    id: number
    depth: number
}

export type TreeProps<T extends TreeItem> = {
    items: Array<T>
    depthIndent: number
    maxDepth: number
    renderItem: (item: T, listeners?: SyntheticEvents) => JSX.Element
    onDragEnd: (items: Array<T>) => void
}

export type OverlayProps = {
    width: number
    initialCoors: Coors
    shift: Coors
}

export type SyntheticEvents = { [key: string]: (e: React.SyntheticEvent) => void }

export type Direction = 1 | -1

export type ItemRef = {
    id: number
    ref: React.RefObject<HTMLElement>
}