import parseFrontMatter from 'gray-matter'
import isEmpty from 'lodash.isempty'
import path from 'path'

import { map, Tree } from './tree'

export interface PageMeta {
  name: string
  specifier: string
  path: string
  pathSegments: string[]
  component: string | null
  routeMeta?: any
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
): Tree<PageMeta> {
  return map(tree, (file: File) => {
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

    return meta
  })
}

function isOmittable(segment: string): boolean {
  return segment === 'index'
}

/**
 * - Remove `.md` from the last path
 * - Omit if the last segment is `index`
 * - Convert dynamic route to `:param` format
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
