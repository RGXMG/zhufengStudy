### redux 三大原则
1. 整个应用的state被储存在一颗object tree中，并且这个object tree只存在于唯一一个store中
2. state是只读的，唯一改变state的方法就是触发action，action是一个用来描述已发生事件的普通对象，使用纯函数来执行修改，即reducers
3. 单一数据来源的设计让react的组件之间通信更加方便
