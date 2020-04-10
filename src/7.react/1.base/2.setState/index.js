/**
 * NOTE state/setState
 *  1. setState为异步更新，所以得谨慎操作连续setState,如下面[note1]
 *  2. 想要连续修改state，可以直接连续使用setState(callback)使用，如下面[note2]
 *  3. react中的setState的第二个参数callback执行时机实在所有同步的setState执行完成之后再统一依次执行，如下面[note3]
 *  2. 不要直接修改state，不会自动触发render，但是我们可以使用forceUpdate进行重新render，也能达到更新界面的目的，不过不推荐
 */

// NOTE note1
// state = { count: 0 };
this.setState({ count: this.state.count + 1 }); // A
this.setState({ count: this.state.count + 1 }); // B
console.log(this.state.count); // C => 0
// A、B、C三条语句都会同步执行，C会打印出0，因为setState方法时异步更新state,
// 所以在执行完A语句后，state.count并未更新，所以B语句中拿到的state.count依然是0，
// C同理拿到的也是0，但是在界面上更新后的state.count是1，而不是2，
// 这个原因是因为setState会将同步连续调用传入的值进行合并后异步更新，
// 所以B语句传入的count会覆盖A语句传入的count，最后更新的值就为1

// NOTE note2
// 想要直接连续更改state，不能直接连续俩次使用setState(Object)，如：
this.setState({ count: this.state.count + 1 }); // A
this.setState({ count: this.state.count + 1 }); // B
// 而是可以直接回调的方式进行设置(也可以使用setState(newState, callback))，如：
this.setState(state => ({ count: state.count + 1 })); // A
this.setState(state => ({ count: state.count + 1 })); // B
// 这样设置，react会将上述俩个回调加入一个队列，待当前同步方式执行完成之后，异步执行上述代码
// 会将A执行之后的state移交给下一个callback，这里就是B

// NOTE note3
// react中的setState的第二个参数为state改变之后的callback，但是这个callback不是在当前state改变之后就执行，而是在当前setState队列全部执行完之后再去统一执行callback，如：
state = { count: 0 };
this.setState(state => ({ count: state.count + 1 }) , () => { console.log(this.state) }); // A
this.setState(state => ({ count: state.count + 1 }) , () => { console.log(this.state) }); // B
this.setState(state => ({ count: state.count + 1 }) , () => { console.log(this.state) }); // C
// 这里A打印的不是1, B打印的也不是2，同理C也不是3，而是ABC都是打印的3，
// 就是因为三个callback都会被所有state改变之后才会统一的执行
