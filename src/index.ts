import fs from 'fs'
import directoryTree, { DirectoryTree } from 'directory-tree'
import { basename, dirname, isAbsolute, join } from 'path'

import { createRoutes, RouteString } from './template/routes'
import { resolveRoutePaths } from './resolve'
import { FileTree } from './resolve'
import prettier from 'prettier'

export interface GenerateConfig {
  folders: string[]
  importPrefix?: string
  dynamicImport?: boolean
  chunkNamePrefix?: string
  nested?: boolean
}

function relativeTo(prefix: string, path: string): string {
  const segments = path.split('/')
  const index = segments.findIndex(seg => seg === prefix)
  return segments.slice(index).join('/')
}

function toPathTree(directoryTree: DirectoryTree, prefix: string): FileTree {
  return {
    value: {
      path: isAbsolute(directoryTree.path)
        ? relativeTo(prefix, directoryTree.path)
        : directoryTree.path,
      type: directoryTree.type
    },
    children: directoryTree?.children?.map(child => toPathTree(child, prefix))
  }
}

export function generateRoutes({
  folders,
  importPrefix = '@/assets/',
  dynamicImport = true,
  chunkNamePrefix = ''
}: GenerateConfig): string {
  const routeStrings: RouteString[] = folders.map(folder => {
    const dirTree = directoryTree(folder, { extensions: /\.md$/ })
    const pathTree = toPathTree(dirTree, basename(folder))

    const meta = resolveRoutePaths(pathTree, importPrefix, file => {
      return fs.readFileSync(join(dirname(folder), file), 'utf8')
    })
    return createRoutes(meta, dynamicImport, chunkNamePrefix)
  })
  const rendererImport: string = `
  import Vue from 'vue'
  
  Vue.component('renderer', resolve => {
    setImmediate(() => resolve({
      render: createElement => createElement('router-view')
    }))
  })
  `
  const imports: string = [rendererImport]
    .concat(routeStrings.map(rs => rs.imports))
    .join('\n')
  const routes: string = routeStrings.map(rs => rs.code).join(',\n')
  return prettier.format(`${imports}\n\nexport default [${routes}]`, {
    parser: 'babel',
    semi: false,
    singleQuote: true
  })
}
