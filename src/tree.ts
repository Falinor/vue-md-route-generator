export type Tree<T> = { value: T; children?: Tree<T>[] }

type ForEachFunction<T> = (node: T) => void

export function forEach<T = any>(
  tree: Tree<T>,
  fn: ForEachFunction<T>
): Tree<T> {
  fn(tree.value)
  if (tree?.children?.length) {
    tree.children.forEach(child => {
      forEach(child, fn)
    })
  }
  return tree
}

type MapFunction<T, U> = (value: T, children?: Tree<T>[]) => U

export function map<T = any, U = any>(
  tree: Tree<T>,
  fn: MapFunction<T, U>
): Tree<U> {
  const node: Tree<U> = {
    value: fn(tree.value, tree.children)
  }
  if (tree?.children?.length) {
    node.children = tree.children.map(child => map(child, fn))
  }
  return node
}

export function flatten<T>(tree: Tree<T>): T[] {
  function flattenRec<T>(acc: T[], node: Tree<T>): T[] {
    acc.push(node.value)
    if (node.children) {
      acc.concat(...node.children.map(child => flattenRec(acc, child)))
    }
    return acc
  }
  return flattenRec<T>([], tree)
}

export function flatMap<T = any, U = any>(
  tree: Tree<T>,
  fn: MapFunction<T, U>
): U[] {
  return flatten(map(tree, fn))
}

export type SortFunction<T> = (a: Tree<T>, b: Tree<T>) => number

export function sort<T = any>(tree: Tree<T>, fn: SortFunction<T>): Tree<T> {
  const children = tree.children ?? []
  if (children.length) {
    tree.children = [...children].sort(fn)
    tree?.children?.forEach(child => {
      sort(child, fn)
    })
  }
  return tree
}
