import { State, Action } from './types'

export const initialState: State = {
    activeIndex: -1,
    overIndex: -1,
    activeDepth: 0,
    depth: 0,
    childCount: 0,
    initialCoors: { x: 0, y: 0 },
    shift: { x: 0, y: 0 },
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'stopDrag':
            return { ...initialState }
        case 'startDrag':
            return {
                activeIndex: action.payload.index,
                overIndex: action.payload.index,
                activeDepth: action.payload.depth,
                depth: action.payload.depth,
                childCount: action.payload.childCount,
                initialCoors: action.payload.initialCoors,
                shift: action.payload.shift,
            }
        case 'setPosition':
            return {
                ...state,
                ...action.payload,
            }
    }
}