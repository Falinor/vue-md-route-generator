import { filter, flatMap, flatten, forEach, map, sort, Tree } from '../src/tree'

interface File {
  name: string
  path: string
  type: string
}

describe('Tree', () => {
  describe('#forEach', () => {
    it('should apply a function to each node', () => {
      const tree: Tree<File> = {
        value: {
          name: 'foo',
          path: 'foo',
          type: 'directory'
        },
        children: [
          {
            value: {
              name: 'bar',
              path: 'foo/bar',
              type: 'directory'
            }
          }
        ]
      }
      forEach(tree, node => {
        node.type = 'file'
      })
      expect(tree).toMatchObject({
        value: { type: 'file' },
        children: [
          {
            value: {
              type: 'file'
            }
          }
        ]
      })
    })
  })

  describe('#map', () => {
    it('should map each node of the tree', () => {
      const tree: Tree<File> = {
        value: {
          name: 'foo',
          path: 'foo',
          type: 'directory'
        },
        children: [
          {
            value: {
              name: 'bar',
              path: 'foo/bar',
              type: 'directory'
            }
          }
        ]
      }
      const newTree = map(tree, node => node.name)
      expect(newTree).toStrictEqual({
        value: 'foo',
        children: [{ value: 'bar' }]
      })
    })
  })

  describe('#flatten', () => {
    it('should flatten the tree to an array of nodes', () => {
      const tree: Tree<string> = {
        value: 'foo',
        children: [
          {
            value: 'bar',
            children: [
              { value: 'baz' },
              { value: 'foobar', children: [{ value: 'foobaz' }] }
            ]
          }
        ]
      }
      const actual = flatten(tree)
      expect(actual).toStrictEqual<string[]>([
        'foo',
        'bar',
        'baz',
        'foobar',
        'foobaz'
      ])
    })
  })

  describe('#flatMap', () => {
    it('should map the nodes and flatten them to an array of nodes', () => {
      const tree: Tree<{ name: string }> = {
        value: { name: 'foo' },
        children: [
          {
            value: { name: 'bar' },
            children: [
              {
                value: { name: 'baz' }
              },
              {
                value: { name: 'foobar' },
                children: [
                  {
                    value: { name: 'foobaz' }
                  }
                ]
              }
            ]
          }
        ]
      }
      const actual = flatMap(tree, node => node.name)
      expect(actual).toStrictEqual<string[]>([
        'foo',
        'bar',
        'baz',
        'foobar',
        'foobaz'
      ])
    })
  })

  describe('#sort', () => {
    it('should sort each level of the tree using a compare function', () => {
      const tree: Tree<number> = {
        value: 1,
        children: [
          { value: 2 },
          { value: 1 },
          { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 1 }] }
        ]
      }
      const actual = sort(tree, (a, b) => a.value - b.value)
      expect(actual).toStrictEqual<Tree<number>>({
        value: 1,
        children: [
          { value: 1 },
          { value: 2 },
          { value: 3, children: [{ value: 1 }, { value: 2 }, { value: 3 }] }
        ]
      })
    })
  })

  describe('#filter', () => {
    it('should return an empty tree if no node matches', () => {
      const tree: Tree<number> = {
        value: 2,
        children: [{ value: 4 }, { value: 7 }]
      }
      const actual = filter(tree, value => value % 3 === 0)
      expect(actual).toBeNull()
    })

    it('should filter out any node not matching the given function', () => {
      const tree: Tree<{ path: string; type: string }> = {
        value: { path: 'guides', type: 'directory' },
        children: [
          {
            value: { path: 'guides/2.md', type: 'file' }
          },
          {
            value: { path: 'guides/1', type: 'directory' },
            children: [
              { value: { path: 'guides/1/__meta__.md', type: 'file' } },
              { value: { path: 'guides/1/1.md', type: 'file' } },
              { value: { path: 'guides/1/2.md', type: 'file' } },
              { value: { path: 'guides/1/3.md', type: 'file' } }
            ]
          }
        ]
      }
      const actual = filter(tree, value => !value.path.endsWith('__meta__.md'))
      expect(actual).toStrictEqual({
        value: { path: 'guides', type: 'directory' },
        children: [
          {
            value: { path: 'guides/2.md', type: 'file' }
          },
          {
            value: { path: 'guides/1', type: 'directory' },
            children: [
              { value: { path: 'guides/1/1.md', type: 'file' } },
              { value: { path: 'guides/1/2.md', type: 'file' } },
              { value: { path: 'guides/1/3.md', type: 'file' } }
            ]
          }
        ]
      })
    })
  })
})
