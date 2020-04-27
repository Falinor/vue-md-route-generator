import path from 'path'

import { generateRoutes } from '../src'

it('Integration test', () => {
  const res = generateRoutes({
    folders: [
      path.resolve(__dirname, 'fixtures', 'foo'),
      path.resolve(__dirname, 'fixtures', 'bar')
    ]
  })
  expect(res).toMatchSnapshot()
})
