import { FileTree, resolveRoutePaths } from '../src/resolve'

function mockReadFile(path: string): string {
  if (path === 'meta.md') {
    return `---
title: Hello
---`
  }

  if (path === 'invalid-meta.vue') {
    return `---
{ invalid: Test }
---`
  }

  if (path === 'guides/__meta__.md') {
    return `---
title: Directory metadata
---`
  }

  if (path === 'guides/1/__meta__.md') {
    return `---
order: 1
---`
  }

  const result = /\/(?<order>\d+)\.md$/.exec(path)
  if (result && result.groups?.order) {
    return `---
order: ${result.groups.order}
---`
  }

  return ''
}

describe('Route resolution', () => {
  function test(name: string, tree: FileTree): void {
    it(name, () => {
      expect(
        resolveRoutePaths(tree, '@/assets/', mockReadFile)
      ).toMatchSnapshot()
    })
  }

  test('resolves routes', {
    value: { path: 'guides', type: 'directory' },
    children: [
      {
        value: { path: 'guides/foo.md', type: 'file' }
      },
      {
        value: { path: 'guides/bar.md', type: 'file' }
      },
      {
        value: { path: 'guides/baz.md', type: 'file' }
      }
    ]
  })

  test('resolves route meta', {
    value: {
      path: 'meta.md',
      type: 'file'
    }
  })

  test('resolves directory meta', {
    value: { path: 'guides', type: 'directory' },
    children: [
      {
        value: { path: 'guides/__meta__.md', type: 'file' }
      },
      {
        value: { path: 'guides/foo.md', type: 'file' }
      }
    ]
  })

  test('resolves routes in the correct order based on metadata', {
    value: { path: 'guides', type: 'directory' },
    children: [
      {
        value: { path: 'guides/2.md', type: 'file' }
      },
      {
        value: { path: 'guides/1', type: 'directory' },
        children: [
          { value: { path: 'guides/1/__meta__.md', type: 'file' } },
          { value: { path: 'guides/1/2.md', type: 'file' } },
          { value: { path: 'guides/1/1.md', type: 'file' } },
          { value: { path: 'guides/1/3.md', type: 'file' } }
        ]
      }
    ]
  })
})
