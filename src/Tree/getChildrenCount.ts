import { TreeItem } from './types'

export const getChildrenCount = (id: string, tree: Array<TreeItem>) => {
  const index = tree.findIndex((item) => item.id === id)
  let count = 0
  for (let i = index + 1; i < tree.length; i++) {
    if (tree[index].depth < tree[i].depth) count++
    else break
  }

  return count
}
