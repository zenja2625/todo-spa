export type Coors = {
    x: number
    y: number
}

export type TreeItem = {
    id: string
    depth: number
}

export type TreeProps<T extends TreeItem> = {
    items: Array<T>
    depthIndent: number
    maxDepth: number
    renderItem: (
        item: T,
        listeners?: SyntheticEvents
    ) => JSX.Element
    onDragEnd: (items: Array<T>) => void
}

export type OverlayProps = {
    value: string
    width: number
    initialCoors: Coors
    shift: Coors
}

export type SyntheticEvents = { [key: string]: (e: React.SyntheticEvent) => void }

export type Direction = 1 | -1
