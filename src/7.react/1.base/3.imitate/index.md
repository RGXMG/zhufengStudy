### 模拟实现一个现代组件架构

实现一个类似于 react 的极简架构组件，使用 es6 的 class 进行构建

#### 架构设计

- 采用 es6 的 class 设计，父类 component 提供公共方法，子类继承父类进行开发功能
- 模仿 react 的 state 设计，使用 setState 更新试图
- 模仿 react 的 render 设计，父类同一调用 render 方法进行渲染试图
- 模仿 react 的 event 事件，将所有的事件进行代理

#### 实现功能

- 提供一个 button，可以进行增加减少 state 的 count
