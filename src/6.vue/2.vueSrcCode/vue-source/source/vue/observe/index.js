import Observer from './observer';
import Watcher from './watcher';
import Dep from './dep';
export function initState(vm){ 
    //做不同的初始化工作 
    let opts = vm.$options;
    if(opts.data){
        initData(vm); // 初始化数据
    }
    if(opts.computed){
        initComputed(vm,opts.computed); // 初始化计算属性
    }
    if(opts.watch){ 
        initWatch(vm); // 初始化watch
    }
}
export function observe(data){
    if(typeof data !== 'object' || data == null) {
        return // 不是对象或者是null 我就不用执行后续逻辑
    }
    if(data.__ob__){ // 已经被监控过了
        return data.__ob__
    }
    return new Observer(data)
}
function proxy(vm,source,key){ // 代理数据  vm.msg = vm._data.msg
    // vm.msg = 'hello'
    // vm._data.msg = 'hello'
    Object.defineProperty(vm,key,{ // vm msg
        get(){  // vm.msg =  vm._data.msg
            return vm[source][key]
        },
        set(newValue){ // vm.msg = vm._data.msg
            vm[source][key] = newValue
        }
    })
}
function initData(vm){ // 将用户插入的数据 通过object.defineProperty重新定义
    let data = vm.$options.data; // 用户传入的data
    data = vm._data = typeof data === 'function'?data.call(vm) :data || {}
    for(let key in data){
         proxy(vm,'_data',key); //会将对vm上的取值操作和赋值操作代理给vm._data 属性
    }
    observe(data); // 观察数据
}
function createComputedGetter(vm,key){
    let watcher = vm._watchersComputed[key]; // 这个watcher 就是我们定义的计算属性watcher
    return function() { // 用户取值是会执行此方法
        if(watcher){
            // 如果dirty 是false的话 不需要重新执行计算属性中的方法
           if(watcher.dirty){ // 如果页面取值 ，而且dirty是true 就会去调用watcher的get方法
            watcher.evaluate();
           } 
           if(Dep.target){ // watcher 就是计算属性watcher dep = [firstName.dep,lastName.Dep]
               watcher.depend();
           }
           return watcher.value
        }
    }
}
// 计算属性 特点 默认不执行，等用户取值的时候在执行，会缓存取值的结果
// 如果依赖的值变化了 会更新dirty属性，再次取值时 可以重新求新值

// watch方法 不能用在模板里，监控的逻辑都放在watch中即可
// watcher 三类 渲染watcher  用户watcher  计算属性watcher
function initComputed(vm,computed){
    // 将计算属性的配置 放到vm上
    let watchers = vm._watchersComputed =  Object.create(null); // 创建存储计算属性的watcher的对象

    for(let key in computed){ // {fullName:()=>this.firstName+this.lastName}
        let userDef = computed[key];
        // new Watcher此时什么都不会做 配置了lazy dirty = true
        watchers[key] = new Watcher(vm,userDef,()=>{},{lazy:true}); // 计算属性watcher 默认刚开始这个方法不会执行
    // vm.fullName
        Object.defineProperty(vm,key,{
            get:createComputedGetter(vm,key)
        }) // 将这个属性 定义到vm上
    }

}
function createWatcher(vm,key,handler,opts){
    // 内部最终也会使用$watch方法
    return vm.$watch(key,handler,opts);
}
function initWatch(vm){
    let watch = vm.$options.watch; // 获取用户传入的watch属性
    for(let key in watch){ // msg(){}
        let userDef = watch[key];
        let handler = userDef;
        if(userDef.handler){
            handler = userDef.handler;
        }
        createWatcher(vm,key,handler,{immediate:userDef.immediate});
    }
}