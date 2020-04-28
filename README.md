# vue-route-generator

[Vue Router](https://github.com/vuejs/vue-router) route config generator.

You may want to use [vue-markdown-routing](https://github.com/Falinor/vue-markdown-routing) to generate routes.

## Overview

This tool generates a JavaScript code that exporting Vue Router's `routes` config by reading your assets directories containing markdown files.

For example, when you have following file structure:

```
assets/
└── guides/
    ├── index.md
    └── foo.md
```

Then run the following script:

```js
const path = require('path')
const { generateRoutes } = require('vue-md-route-generator')

const code = generateRoutes({
  folders: [
    // Your markdown asset directories
    path.resolve(__dirname, 'assets', 'guides')
  ]
})
```

vue-route-generator will generate the following code:

```js
export default [
  {
    name: 'guides',
    path: '/guides',
    children: [
      {
        name: 'guides-index',
        path: '',
        component: () => import('@/assets/guides/index.md')
      },
      {
        name: 'guides-foo',
        path: 'foo',
        component: () => import('@/assets/guides/foo.md')
      }
    ]
  }
]
```

You can save the code and include router instance:

```js
const fs = require('fs')
const { generateRoutes } = require('vue-md-route-generator')

const code = generateRoutes({
  folders: [
    path.resolve(__dirname, 'assets', 'guides')
  ]
})

fs.writeFileSync('./router/routes.js', code)
```

```js
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'

// import generated routes
import routes from './routes'

Vue.use(Router)

export default new Router({
  routes
})
```

## Routing

## Route metadata

The generator supports front-matter metadata in various format. It uses [gray-matter](https://www.npmjs.com/package/gray-matter)
under the hood to handle YAML, JSON, TOML and Coffee formats.

```markdown
---
requiresAuth: true
---

# Hello
```

The generated route config is like the following:

```js
export default [
  {
    name: 'guides',
    path: '/guides',
    children: [
      {
        name: 'guides-index',
        path: '',
        component: () => import('@/assets/guides/index.md'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]
```

## References

### `generateRoutes(config: GenerateConfig): string`

`GenerateConfig` has the following properties:

- `folders`: An array of paths containing markdown files you want to load.
- `importPrefix`: A string that will be added to importing component path (default `@/assets/`).
- `dynamicImport`: Use dynamic import expression (`import()`) to import component (default `true`).
- `chunkNamePrefix`: Prefix for each route chunk name (only available when `dynamicImport: true`).
- `nested`: If `true`, generated route path will be always treated as nested. (e.g. will generate `path: 'foo'` rather than `path: '/foo'`)

## Related Projects

- [vue-markdown-routing](https://github.com/Falinor/vue-markdown-routing): Generate Vue Router routing automatically.

## License

MIT
