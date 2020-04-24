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
})
