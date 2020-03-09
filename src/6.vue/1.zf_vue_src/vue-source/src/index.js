import Vue from 'vue'; // 会默认先查找source 目录下的vue文件夹
// es6 类  构造函数 es5的类

let vm = new Vue({
    el:document.getElementById('app'), // 表示要渲染的元素是app
    data(){
        return { // Object.defineProperty
            msg:'hello',
            school:{name:'zf',age:10},
            arr:[[1],2,3],
            firstName:'feng',
            lastName:'zhu'
        }
    },
    computed:{
        fullName(){
            return this.firstName + this.lastName
        }
    },
    watch:{ // 这东西没法用到模板里
        msg:{ 
            handler(newValue,oldValue){
                console.log(newValue,oldValue);
            },
            immediate:true
        }
    }
});
// vm.msg = vm._data.msg // 代理

// 对原生的方法进行劫持
// 如果新增的属性 也是对象类型 我们需要对这个对象 也进行观察 observe

setTimeout(() => {
    // vm.msg = 'world'; // dep = [ 渲染watcher ]
    // vm.msg = 'hello';
    // vm.msg = 'world';
    // vm.msg = 'xxx'; // 最终就拿vm.msg = 'xxx'  来更新就好了
    // vm.school.name = 'zf1'// dep=[渲染watcher]
    // // vue的特点就是批量更新 防止重复渲染

    // ----------- 数组更新  更数组中的对象的属性是可以的 因为我们拦截了对象的get和set
    // vm.arr[0].push(100); // 数组的依赖收集   [[1],2,3]
    // console.log(vm);

    // ----------- watch的使用
    // vm.msg = 'world'

    // 更改计算属性
    vm.firstName = 'jiang'; // firstName = [watcher 计算属性watcher,渲染watcher]
}, 1000);

// 什么样的数组会被观测 [0,1,2] observe 不能直接改变索引不能被检测到
// [1,2,3].length--  因为数组的长度变化 我们没有监控

// [{a:1}] // 内部会对数组里的对象进行监控
// [].push / shift unshift 这些方法可以被监控 vm.$set 内部调用的就是数组的splice