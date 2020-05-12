import { PageMeta } from '../resolve'
import { flatMap, Tree } from '../tree'

export type PageMetaTree = Tree<PageMeta>

function createChildrenRoute(children: PageMetaTree[]): string {
  return `children: [${children.map(createRoute).join(',')}],`
}

function createRoute(meta: PageMetaTree): string {
  const children = !meta.children ? '' : createChildrenRoute(meta.children)

  // If default child exists, the route should not have a name.
  const routeName = meta.children?.some(m => m.value.path === '')
    ? ''
    : `name: '${meta.value.name}',`

  const routeMeta = meta.value.routeMeta
    ? `meta: ${JSON.stringify(meta.value.routeMeta, null, 2)},`
    : ''

  const redirect: PageMetaTree =
    meta.children?.find(child => child.value.specifier.endsWith('Index')) ??
    (meta.children?.[0] as PageMetaTree)
  const specifier = meta.value.component
    ? `component: ${meta.value.specifier},`
    : `redirect: { name: '${redirect.value.name}' },`

  return `
  {
    ${routeName}
    path: '${meta.value.path}',
    ${specifier}${routeMeta}${children}
  }
  `
}

function createImport(
  meta: PageMeta,
  dynamic: boolean,
  chunkNamePrefix: string
): string {
  if (meta.component === null) {
    return ''
  }

  return dynamic
    ? `function ${meta.specifier}() { return import(/* webpackChunkName: "${chunkNamePrefix}${meta.name}" */ '${meta.component}') }`
    : `import ${meta.specifier} from '${meta.component}'`
}

export interface RouteString {
  imports: string
  code: string
}

export function createRoutes(
  meta: PageMetaTree,
  dynamic: boolean,
  chunkNamePrefix: string
): RouteString {
  const imports: string = flatMap(meta, node =>
    createImport(node, dynamic, chunkNamePrefix)
  ).join('\n')

  const code = createRoute(meta)
  return { imports, code }
}
