# [生命周期](https://zh-hans.reactjs.org/docs/react-component.html?#commonly-used-lifecycle-methods)

### constructor 的 super(props)

1. 在组件中的构造函数中调用 super(props)，这样就能在 constructor 中直接使用 this.props，可以用来填充默认的 props，如：

```javascript
class Button extends React.component {
  constructor() {
    super(props);
    // 给this.props赋默认值
    this.props.name = "button";
  }
}
```

2. 如果不传入 props，则不能在 constructor 中直接使用 props，但是在其他地方还是能拿到 this.props 的；

### componentWillReceiveProps

> 方法第一次不会执行，只有当收到新的 props 才会执行

### 组件的挂载顺序

父开始执行生命周期 -> 父 componentWillMount -> 父 render -> 解析子组件间 -> 子组件执行完整的生命周期 -> 父 componentDidMount；

### 生命周期中的 ajax 方法调用

#### 在 componentWilMount 中调用 ajax 理由：

在执行 render 之前拿到 ajax 数据，就能调用 setState 方法，将 state 更新，然后 render 就可以直接渲染最新的 render；

- 误区： 在执行 componentWillMount 时，因为 ajax 是异步请求，而根据 js 的执行机制来说，react 并不会等待 ajax 获取完成之后再去执行 render，所以异步 ajax 不存在可能会只执行一次 render；
- 提示： 如果是同步的 setState 则是可以放在 componentWillMount，这样只会触发一次 render；

##### 不在 componentWillMount 中调用 ajax 理由：

- 异步 ajax 无法保证一次 render；
- react ssr 时，componentWillMount 会在服务端和客户端分别执行一次，不利于同构；
- react16 之后，因为引入了 fiber，componentWillMount 可能会被多次调用；
- 【新版已经将该生命周期废弃】

#### 使用 componentDidMount 的理由：

- 能保证在任何情况下都只会执行一次；

### getDerivedStateFormProps【[官方](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)】

> 创建时和更新时都会执行
> 该生命周期方法为新增方法，是为了解决内部组件要根据外部 props 改变内部 state 增设，也是为了代替 componentWillReceiveProps

### getSnapshotBeforeUpdate
该方法并不常用，可以用在一些UI库中和一些特殊的逻辑，如在一个滚动试图中，当滚动位置不变，向顶部添加一个数据，这个时候滚动位置不会发生变化，但是内容就会被顶下来，就可以通过这个方法进行手动改变dom的scrollTop

### 新本 lifeCycle：

1. 保留 constructor
2. 去掉 componentWillMount
3. 去掉 componentWillReceiveProps
4. 去掉 componentWillUpdate
5. 新增 getDerivedStateFormProps
6. 新增 getSnapshotBeforeUpdate【[官方](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)】
