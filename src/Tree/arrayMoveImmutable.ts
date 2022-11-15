import { TreeItem } from './types'
import { getChildrenCount } from './getChildrenCount'

export const arrayMoveImmutable = <T extends TreeItem>(
  items: Array<T>,
  fromId: string,
  toId: string,
  childCount: number,
  depthDelta: number
) => {
  const fromIndex = items.findIndex((item) => item.id === fromId)
  let toIndex = items.findIndex((item) => item.id === toId)
  if (!items[toIndex].isOpen && toIndex > fromIndex) {
    toIndex += getChildrenCount(toId, items)
  }

  const newItems = Array<T>(items.length)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (i >= fromIndex && i <= fromIndex + childCount) {
      newItems[
        toIndex + i - fromIndex - childCount * +(toIndex > fromIndex)
      ] = { ...item, depth: item.depth + depthDelta }
    } else if (i > fromIndex && i <= toIndex) {
      newItems[i - (1 + childCount)] = item
    } else if (i < fromIndex && i >= toIndex) {
      newItems[i + (1 + childCount)] = item
    } else {
      newItems[i] = item
    }
  }

  return newItems
}
