import { Coors, TreeItem } from './types'

export const initialState = {
  activeIndex: -1,
  overIndex: -1,
  activeDepth: 0,
  initialDepth: 0,
  initialPosition: { x: 0, y: 0 } as Coors,
  order: Array<TreeItem>(),
  activeChildren: Array<TreeItem>()
}
export type State = typeof initialState
export type Action =
  | {
      type: 'dragStart'
      payload: {
        id: string
        initialPosition: Coors
      }
    }
  | {
      type: 'move'
      payload: {
        index: number
        depth: number
      }
    }
  | {
      type: 'dragEnd'
    }
  | {
      type: 'setOrder'
      payload: Array<TreeItem>
    }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'dragStart':
      return state.order.reduce(
        (state, item) => {
          const { order, activeChildren } = state

          if (order.length) {
            const last = order[order.length - 1]
            if (last.id === action.payload.id && last.depth < item.depth)
              activeChildren.push(item)
            else order.push(item)
          } else order.push(item)

          if (item.id === action.payload.id) {
            state.activeIndex = order.length - 1
            state.overIndex = order.length - 1
            state.activeDepth = item.depth
            state.initialDepth = item.depth
          }

          return state
        },
        {
          ...initialState,
          order: [],
          activeChildren: [],
          initialPosition: action.payload.initialPosition,
        } as State
      )

    case 'move':
      return {
        ...state,
        overIndex: action.payload.index,
        activeDepth: action.payload.depth
      }
      //...initialState
    case 'dragEnd':
      return {
        ...state,
        activeIndex: -1,
        overIndex: -1,
        activeChildren: [],
        order: state.order.reduce((order, item, index) => {
          order.push(item)
          if (index === state.activeIndex) order.push(...state.activeChildren)
          return order
        }, Array<TreeItem>())
      }
    case 'setOrder':
      return {
        ...initialState,
        order: action.payload.reduce((order, item) => {
          if (order.length) {
            const last = order[order.length - 1]
            if (last.isOpen || last.depth >= item.depth) order.push(item)
          } else order.push(item)

          return order
        }, Array<TreeItem>())
      }
  }
}
