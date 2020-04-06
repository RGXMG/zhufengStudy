## vue ssr [官文](https://ssr.vuejs.org/zh/guide/)

主要使用到 vue-server-renderer 模块,

### 主要流程

在服务端接收到一个请求时，会通过 vue-server-renderer 模块去加载一个 vue 实例，在 server 的入口文件中，我们可以拿到当前请求的 url 地址，在执行完本该在客户端执行的代码之后，就能拿到一个完整的 Vue 实例，我们在通过创建的 VueRouter 实例去动态的设置(push)路径 path，然后 app 就会渲染一个新的对应的路由页面，然后将 app 交给 vue-server-renderer 处理，最后把处理结果交个服务端代码返回，如 koa 中的 ctx.body = render.createToString();

### 处理 client 的 bundle 以及 server 的 bundle

要使用 ssr，我们需要配置俩套打包文件的配置，如使用 webpack，则使用俩套规则，在 client 的 webpack 配置文件中需要引入并使用 require('vue-server-renderer/client-plugin')插件，它会根据打包文件生成一份`vue-ssr-client-manifest.json`文件，对应 bundle 文件。而在 server 的 webpack 配置文件中则需要引入并使用 require('vue-server-renderer/server-plugin')插件，它会根据打包后的文件生成一份`vue-ssr-server-bundle.json`配置文件，对应 bundle 文件。然后再使用 createBundleRenderer 创建一个 renderer 时，就需要使用这俩个配置文件。如：render.createBundleRenderer(serverManifest, {template,clientManifest})，其中 template 文件为 ssr 的 html 模板，该模板中比如提供一个注释`<!--vue-ssr-outlet-->`；

##### 注意：在 server 的 webpack 的配置文件中，我们需要将 target 设置为 node，并在 output 中将 libraryTarget 设置为`commonjs2`, 上述俩个设置都是为了确保 server-entry 文件能直接被 node 使用；

### 处理静态资源

因为使用 ssr 渲染，所以我们打包后的资源并不是位于当前后台服务的根目录，所以我们需要为 dist 目录建立一个静态资源映射，如 koa 中使用`koa-static`模块，然后`app.use(static('../dist'))`

### router 匹配

ssr 中的路由匹配是通过访问服务器时的 path 决定，当一个访问来之后，我们在执行完 vue 实例之后，需要实现`router.onRead`的回调函数，router 加载并匹配到所有路劲之后就会调用该回调函数，在该函数在内部我们可以通过`router.getMethodComponents`方法拿到所有要执行的组件，该方法返回一个数组，如果该数组为空，则表示未匹配到路径，我们可以对其作出 404 处理等等

### vuex 处理

想要在 ssr 中使用 store，其实很简单，可以直接在实例化 vue 时，引入 store 即可。但是如果我们想要在服务端渲染时就使用 store，如调用 action 之类的，我们在可以组件中约定一个`asyncData`(nuxt.js 中就是约定该方法)方法，该方法恒返回一个 promise，在 router 的`onReady`方法内，我们可以使用`router.getMethodComponents`拿到所有的 components 然后依次调用`asyncData`方法，并且传入 store，这样在所有的`asyncData`方法执行完之后，我们可以将最新的`store.state`赋值给`context`，这样`vue-server-renderer`会自动帮我们把 state 值给挂载到`window.__INITIAL_STATE__`上，我们就可以在创建 vue 实例的文件中作出判断，如果存在这个变量，我们就可以使用`store.replaceState`将 state 替换为最新的 state；

**注意：`asyncData`只能在 router 的配置文件 path 对应的一级 component 中定义，其他页面之间引用的普通 component 不会被调用**
