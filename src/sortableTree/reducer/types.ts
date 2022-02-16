import { Coors } from '../types'

export type State = {
    activeIndex: number
    overIndex: number
    childCount: number
    activeDepth: number
    depth: number
    initialCoors: Coors
    shift: Coors
}

export type Action =
    | {
          type: 'setPosition'
          payload: {
              overIndex: number
              depth: number
          }
      }
    | {
          type: 'startDrag'
          payload: {
              index: number
              depth: number
              childCount: number
              initialCoors: Coors
              shift: Coors
          }
      }
    | {
          type: 'stopDrag'
      }