## render props VS HOC模式
总的来说，render props其实和高阶组件类似，就是在puru component上增加state，响应react的生命周期。
对于HOC模式来说，优点如下：

支持ES6

复用性强，HOC为纯函数且返回值为组件，可以多层嵌套

支持传入多个参数，增强了适用范围

当然也存在如下缺点：

当多个HOC一起使用时，无法直接判断子组件的props是哪个HOC负责传递的

多个组件嵌套，容易产生同样名称的props

HOC可能会产生许多无用的组件，加深了组件的层级

Render Props模式的出现主要是为了解决HOC所出现的问题。优点如下所示：

支持ES6

不用担心props命名问题，在render函数中只取需要的state

不会产生无用的组件加深层级

render props模式的构建都是动态的，所有的改变都在render中触发，可以更好的利用组件内的生命周期。

当然笔者认为，对于Render Props与HOC两者的选择，应该根据不同的场景进行选择。Render Props模式比HOC更直观也更利于调试，而HOC可传入多个参数，能减少不少的代码量。

Render Props对于只读操作非常适用，如跟踪屏幕上的滚动位置或鼠标位置。 HOC倾向于更好地执行更复杂的操作，例如以上的localStorage功能。


作者：拉风的咖菲猫
链接：http://www.imooc.com/article/79154
来源：慕课网
