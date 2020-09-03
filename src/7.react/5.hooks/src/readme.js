/**
 * NOTE hooks
 *  1. 每次渲染都是独立的闭包
 *  2. 每一次渲染都有它自己的事件处理函数
 *
 *  NOTE 常用hooks
 *   useState: 定义一个state，{any|function}，function时为惰性求state，只会在使用state的时候执行一次
 *   useMemo: 可以根据deps的浅比较计算是否需要重新生成值，如：useMemo(() => ({ name }), [name]);
 *   useCallback: 可以根据deps的浅比较计算是否需要重新生成函数，如：useCallback((name) => setName(name), [name]);
 *   useReducer: 适用于逻辑复杂一点的state管理；
 *   useContext: useContext(context)返回Provider的value值，比使用Context.consumer要简洁一些；
 *   useEffect(fn, deps): 副作用处理，异步调用，相当于class组建的componentDidMount以及componentDidUpdate
 *       1. 每次渲染都会产生一个新的effect，useEffect的fn可以返回一个清除函数，相当于componentWillUnMount;
 *       2. deps为[]时，只会执行一次，因为没有依赖变化，deps不传递时，每次都会渲染；
 *   useRef: 在函数时组件中使用，对比为createRef，createRef每次都会创建一个新的{current: undefined}对象, 而useRef每次渲染都始终为第一次创建得{current}对象，纯函数之间的ref引用，如父组件的ref想引用子组件中的input组件，则可以使用forwardRef进行转发；
 *
 *   NOTE 更多的hooks
 *    useImperativeHandle：可以自定义外部使用该组件的ref值对象包含哪些属性，如只能让外部使用focus属性：
 *      ```useImperativeHandle(parentRef, () => { focus: inputRef.focus });```
 *    useLayoutEffect: 在页面更新之后，需要重新渲染之前(浏览器重新painting之前)同步调用，可以在这里更改DOM元素，能够达到同步更改的效果，可以在该方法中使用alert阻塞页面，然后观察值得变化；因为这个方法时同步的，会阻塞页面的渲染，所以这里面不能进行耗时操作；
 */
