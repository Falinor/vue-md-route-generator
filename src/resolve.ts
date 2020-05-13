import parseFrontMatter from 'gray-matter'
import isEmpty from 'lodash.isempty'
import path from 'path'

import { filter, map, sort, Tree } from './tree'

export interface PageMeta {
  name: string
  specifier: string
  path: string
  pathSegments: string[]
  component: string | null
  routeMeta?: unknown
}

export interface File {
  path: string
  type: 'directory' | 'file'
}

export type FileTree = Tree<File>
export type PageMetaTree = Tree<PageMeta>

export function resolveRoutePaths(
  tree: FileTree,
  importPrefix: string,
  readFile: (path: string) => string
): PageMetaTree {
  return sortByMeta(
    filterDirectoryMeta(
      map(tree, (file: File, children?: FileTree[]) => {
        const segments: string[] = file.path.split('/')
        const meta: PageMeta = {
          name: pathToName(segments),
          path: pathToRoute(segments, 0, false),
          pathSegments: toActualPath(segments),
          component: null,
          specifier: pathToSpecifier(segments)
        }

        if (file.type === 'file') {
          const content = readFile(file.path)
          const { data } = parseFrontMatter(content)
          if (!isEmpty(data)) {
            meta.routeMeta = data
          }
          meta.component = importPrefix + file.path
        }

        if (file.type === 'directory' && children?.length) {
          const metaFile = children.find(
            child =>
              child.value.type === 'file' &&
              basename(child.value.path) === '__meta__'
          )
          if (metaFile !== undefined) {
            const content = readFile(metaFile.value.path)
            const { data } = parseFrontMatter(content)
            if (!isEmpty(data)) {
              meta.routeMeta = data
            }
          }
        }

        return meta
      })
    )
  )
}

function sortByMeta(tree: PageMetaTree): PageMetaTree {
  return sort(tree, (a: PageMetaTree, b: PageMetaTree): number => {
    const routeMeta1 = a.value.routeMeta
    const routeMeta2 = b.value.routeMeta

    if (hasOrder(routeMeta1)) {
      if (hasOrder(routeMeta2)) {
        return routeMeta1.order - routeMeta2.order
      }
    }

    if (hasOrder(routeMeta2)) {
      return 1
    }

    return 0
  })
}

function hasOrder(obj: unknown): obj is { order: number } {
  return typeof obj === 'object' && obj !== null && obj.hasOwnProperty('order')
}

function filterDirectoryMeta(tree: PageMetaTree): PageMetaTree {
  return filter(
    tree,
    meta => !meta.component?.endsWith('__meta__.md')
  ) as PageMetaTree
}

function isOmittable(segment: string): boolean {
  return segment === 'index'
}

/**
 * - Remove `.md` from the last path
 * - Omit if the last segment is `index`
 */
function toActualPath(segments: string[]): string[] {
  const lastIndex = segments.length - 1
  const last = basename(segments[lastIndex])

  const segmentsWithoutLast = segments.slice(0, -1)
  return isOmittable(last)
    ? segmentsWithoutLast
    : segmentsWithoutLast.concat(last)
}

function pathToName(segments: string[]): string {
  const last = segments[segments.length - 1]
  return segments
    .slice(0, -1)
    .concat(basename(last))
    .join('-')
}

function pathToSpecifier(segments: string[]): string {
  const name = pathToName(segments)
  const replaced = name
    .replace(/(^|[^a-zA-Z])([a-zA-Z])/g, (_, a, b) => {
      return a + b.toUpperCase()
    })
    .replace(/[^a-zA-Z0-9]/g, '')

  return /^\d/.test(replaced) ? '_' + replaced : replaced
}

function pathToRoute(
  segments: string[],
  parentDepth: number,
  nested: boolean
): string {
  const prefix = nested || parentDepth > 0 ? '' : '/'
  return (
    prefix +
    toActualPath(segments)
      .slice(parentDepth)
      .join('/')
  )
}

function basename(filename: string): string {
  return path.basename(filename, '.md')
}
