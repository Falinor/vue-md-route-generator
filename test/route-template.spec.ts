import { createRoutes } from '../src/template/routes'
import { PageMetaTree } from '../src/resolve'

describe('Route template', () => {
  it('should configure chunk name prefix', () => {
    const meta: PageMetaTree = {
      value: {
        name: 'foo',
        path: '/foo',
        pathSegments: ['foo'],
        specifier: 'Foo',
        component: '@/assets/foo.md'
      }
    }

    expect(createRoutes(meta, true, 'assets-')).toMatchSnapshot()
  })

  it('should allow static imports', () => {
    const meta: PageMetaTree = {
      value: {
        name: 'foo',
        path: '/foo',
        pathSegments: ['foo'],
        specifier: 'Foo',
        component: '@/assets/foo.md'
      }
    }

    expect(createRoutes(meta, false, '')).toMatchSnapshot()
  })

  it('should generate routes', () => {
    const meta: PageMetaTree = {
      value: {
        component: null,
        name: 'guides',
        path: '/guides',
        pathSegments: ['guides'],
        specifier: 'Guides'
      },
      children: [
        {
          value: {
            name: 'guides-foo',
            specifier: 'GuidesFoo',
            path: 'foo',
            pathSegments: ['guides', 'foo'],
            component: '@/assets/guides/foo.md'
          }
        },
        {
          value: {
            name: 'guides-bar',
            specifier: 'GuidesBar',
            path: 'bar',
            pathSegments: ['guides', 'bar'],
            component: '@/assets/guides/bar.md'
          }
        }
      ]
    }

    expect(createRoutes(meta, true, '')).toMatchSnapshot()
  })

  it('should not include name if the route has a default child', () => {
    const meta: PageMetaTree = {
      value: {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        component: null
      },
      children: [
        {
          value: {
            name: 'foo-index',
            specifier: 'FooIndex',
            path: '',
            pathSegments: ['foo'],
            component: '@/assets/foo/index.md'
          }
        }
      ]
    }
    expect(createRoutes(meta, true, '')).toMatchSnapshot()
  })

  it('should generate route meta', () => {
    const meta: PageMetaTree = {
      value: {
        name: 'foo',
        specifier: 'Foo',
        path: '/foo',
        pathSegments: ['foo'],
        routeMeta: {
          title: 'Hello'
        },
        component: '@/assets/foo.md'
      }
    }
    expect(createRoutes(meta, false, '')).toMatchSnapshot()
  })
})
