import { flatMap, flatten, forEach, map, Tree } from '../src/tree'

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
})
