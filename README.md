# vue-route-generator

[Vue Router](https://github.com/vuejs/vue-router) route config generator.

You may want to use [vue-auto-routing](https://github.com/ktsn/vue-auto-routing) for auto generating routing or [vue-cli-plugin-auto-routing](https://github.com/ktsn/vue-cli-plugin-auto-routing) which includes all useful features on routing.

## Overview

This tool generates a JavaScript code that exporting Vue Router's `routes` config by reading your Vue components directory.

For example, when you have following file structure:

```
pages/
├── index.vue
├── users.vue
└── users/
    └── _id.vue
```

Then run the following script:

```js
const { generateRoutes } = require('vue-md-route-generator')

const code = generateRoutes({
  folders: ['./assets/guides'] // Your markdown asset directories
})
```

vue-route-generator will generate like the following code (beautified the indentations etc.):

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
  folders: ['./assets/guides']
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

The routing is inspired by [Nuxt routing](https://nuxtjs.org/guide/routing) and is implemented with the same functionality.

### Partials

Directories and files started and ended with `__` (two underscores, e.g. `__foo__.vue`) will be ignored. You can use them as partial components which will be used in some page components.

## Route Meta

If the components have `<route-meta>` custom block, its json content is passed to generated route meta.

For example, if `index.vue` has the following `<route-meta>` block:

```markdown
---
requiresAuth: true
---

# Hello
```

The generated route config is like following:

```js
module.exports = [
  {
    name: 'guides-index',
    path: '/guides',
    component: () => import('@/assets/guides/index.md'),
    meta: {
      requiresAuth: true
    }
  }
]
```

## References

### `generateRoutes(config: GenerateConfig): string`

`GenerateConfig` has the following properties:

- `pages`: Path to the directory that contains your page components.
- `importPrefix`: A string that will be added to importing component path (default `@/pages/`).
- `dynamicImport`: Use dynamic import expression (`import()`) to import component (default `true`).
- `chunkNamePrefix`: Prefix for each route chunk name (only available when `dynamicImport: true`).
- `nested`: If `true`, generated route path will be always treated as nested. (e.g. will generate `path: 'foo'` rather than `path: '/foo'`)

## Related Projects

- [vue-cli-plugin-auto-routing](https://github.com/ktsn/vue-cli-plugin-auto-routing): Vue CLI plugin including auto pages and layouts resolution.
- [vue-router-layout](https://github.com/ktsn/vue-router-layout): Lightweight layout resolver for Vue Router.
- [vue-auto-routing](https://github.com/ktsn/vue-auto-routing): Generate Vue Router routing automatically.

## License

MIT
