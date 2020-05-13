export type Tree<T> = { value: T; children?: Tree<T>[] }

type ForEachFunction<T> = (node: T) => void

export function forEach<T = any>(tree: Tree<T>, fn: ForEachFunction<T>): void {
  const { value, children } = tree
  fn(value)

  if (!children) {
    return
  }

  children.forEach(child => {
    forEach(child, fn)
  })
}

type MapFunction<T, U> = (value: T, children?: Tree<T>[]) => U

export function map<T = any, U = any>(
  tree: Tree<T>,
  fn: MapFunction<T, U>
): Tree<U> {
  const { value, children } = tree

  if (!children) {
    return { value: fn(value) }
  }

  return {
    value: fn(value, children),
    children: children.map(child => map(child, fn))
  }
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
  const { value, children } = tree

  if (!children) {
    return tree
  }

  return {
    value,
    children: [...children].map(child => sort(child, fn)).sort(fn)
  }
}

export type FilterFunction<T> = (value: T, children?: Tree<T>[]) => boolean

export function filter<T = any>(
  tree: Tree<T>,
  fn: FilterFunction<T>
): Tree<T> | null {
  if (!fn(tree.value)) {
    return null
  }

  if (!tree.children) {
    return tree
  }

  return {
    value: tree.value,
    children: tree.children
      .map(child => filter(child, fn))
      .filter(v => v !== null) as Tree<T>[]
  }
}
