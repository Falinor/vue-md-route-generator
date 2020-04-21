import { createRoutes } from '../src/template/routes'
import { PageMeta } from '../src/resolve'

describe('Route template', () => {
  it('should generate routes', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md'
      },
      {
        name: 'bar',
        specifier: 'Bar',
        path: '/bar',
        pathSegments: ['bar'],
        component: '@/assets/bar.md'
      }
    ]

    expect(createRoutes(meta, true, '')).toMatchSnapshot()
  })

  it('should generate nested routes', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md',
        children: [
          {
            name: 'bar',
            specifier: 'FooBar',
            path: 'bar',
            pathSegments: ['foo', 'bar'],
            component: '@/assets/bar.md'
          },
          {
            name: 'baz',
            specifier: 'FooBaz',
            path: 'baz',
            pathSegments: ['foo', 'baz'],
            component: '@/assets/baz.md'
          }
        ]
      }
    ]

    expect(createRoutes(meta, true, '')).toMatchSnapshot()
  })

  it('should generate static import code', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md'
      },
      {
        name: 'bar',
        specifier: 'Bar',
        path: '/bar',
        pathSegments: ['bar'],
        component: '@/assets/bar.md'
      }
    ]

    expect(createRoutes(meta, false, '')).toMatchSnapshot()
  })

  it('should generate route meta', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md',
        routeMeta: {
          title: 'Hello'
        }
      }
    ]

    expect(createRoutes(meta, false, '')).toMatchSnapshot()
  })

  it('should configure chunk name prefix', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md'
      },
      {
        name: 'bar',
        specifier: 'Bar',
        path: '/bar',
        pathSegments: ['bar'],
        component: '@/assets/bar.md'
      }
    ]

    expect(createRoutes(meta, true, 'page-')).toMatchSnapshot()
  })

  it('should not include name if the route has a default child', () => {
    const meta: PageMeta[] = [
      {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: '@/assets/foo.md',
        children: [
          {
            name: 'foo-index',
            specifier: 'FooIndex',
            path: '',
            pathSegments: ['foo'],
            component: '@/pages/foo/index.md'
          }
        ]
      }
    ]

    expect(createRoutes(meta, true, '')).toMatchSnapshot()
  })
})
