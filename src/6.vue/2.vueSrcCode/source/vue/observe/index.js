import Observe from "./observe";
import Watcher from "./watcher";
import Dep from "./dep";
/**
 * 初始化vm上的数据
 * computed watch等等
 * @param vm
 */
function initState(vm) {
  const opts = vm.$options;
  // 初始化data
  if (opts.data) {
    initData(vm);
  }
  // 初始化computed
  if (opts.computed) {
    initComputed(vm);
  }
  // 初始化watch
  if (opts.watch) {
    initWatch(vm);
  }
}

/**
 * 将vm上的值操作代理到source上
 * @param vm
 * @param source
 * @param key
 */
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(nv) {
      vm[source][key] = nv;
    },
  });
}

function observe(data) {
  // 不是对象或者是null，就不能执行后续逻辑
  if (typeof data !== "object" || data == null) {
    return;
  }
  // 判断data上面是否挂在了__ob__属性
  // 如果挂在了该属性，则表示该对象已经被监听过，无需再次执行，直接返回
  // 为了避免用户手动调用该方法
  if (data.__ob__) {
    return data.__ob__;
  }
  return new Observe(data);
}
/**
 * 将用户传入的数据，通过Object.definedProperty重新定义
 * @param vm
 */
function initData(vm) {
  let data = vm.$options.data;
  // 保存一份在vm._data中，用于改变监听；
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};

  // 将vm上的取值和赋值操作代理到vm._data上
  // 如访问时vm.msg实际上访问的是vm._data.msg
  //
  for (const key in data) {
    proxy(vm, "_data", key);
  }

  // 观察数据
  observe(vm._data);
}

/**
 * NOTE 创建计算属性的getter方法
 * 在该函数内部判断computed对应的watcher的dirty是否为true，即是否执行过获取值
 * 如果为false，则表示获取过值，直接去watcher中的缓存值
 * 并且向所使用的观测数据中的dep中添加渲染watcher，这样在数发生改变后，会首先通知computed对应的watcher重新计算值，然后还会重新渲染
 * @param vm
 * @param key
 * @returns {function(...[*]=)}
 */
function createComputedGetter(vm, key) {
  const watcher = vm._watchersComputed[key];
  return function () {
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        // 首先computed内部是依赖了data中的数据，在上面的watcher.evaluate中已经进行了computed的函数运算
        // 在运算过程中，data中的数据已经将该computed的watcher加入到了自己的dep实例的sub(订阅)属性中，即自己变化便会通知computed的watcher执行
        // 而computed这边的watcher也已经将该data数据的dep实例保存在了自己的watcher的dep属性中
        // 当有其他的computed或者watch依赖于自己，便会通过下面这个方法watcher.depend()，遍历自己的watcher的dep属性(保存data的dep)，将依赖于自己的watcher加入到对应的data的sub订阅中
        // 这样一来，当data变化后，会一次通知所有应该变化的watcher；而非一层一层的进行通知
        /**
         * export default {
         *   data() {
         *     return {
         *       // 在defineReactive中会创建一个dep实例Q
         *       name: 'A'
         *     }
         *   },
         *   computed: {
         *     // 会创建一个watcherA
         *     getFullName() {
         *       // 使用了this.name，即在dep实例Q中的sub属性保存了watcherA
         *       // 然后watcherA的dep属性中保存了dep实例Q
         *       return this.name + 'B';
         *     },
         *     // 会创建一个watcherB
         *     // 又因为依赖watcherA，所以在watcherA中应该加入B
         *     fullNameLength() {
         *       return this.getFullName.length;
         *     }
         *   },
         *   // 会创建一个watcherC
         *   // 又因为依赖watcherB，所以在watcherA中应该加入C
         *   watch: {
         *     'fullNameLength'(n, o) {
         *       console.log(n, o);
         *     }
         *   }
         * }
         *
         */
        watcher.depend();
      }
      // computed计算属性的值将会缓存到watcher的value上
      return watcher.value;
    }
  };
}

/**
 * NOTE 创建computed属性
 * 对每一个computed对象属性对建立一个watcher，
 * 该watcher首次不会执行get方法，并且exprOrFn属性就为computed对象中的处理函数
 * @param vm
 */
function initComputed(vm) {
  // 定义一个_watchersComputed属性，将vm上所有的computed进行保存
  vm._watchersComputed = Object.create(null);
  const computed = vm.$options.computed;
  for (const key in computed) {
    // 将新创建的watcher进行添加到vm上，
    // lazy代表为computed属性，watcher就不会立即执行get方法
    vm._watchersComputed[key] = new Watcher(vm, computed[key], () => {}, {
      lazy: true,
    });

    // 将computed的key值定义到vm上，这样就能够直接通过vm[key]获取
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key),
    });
  }
}

/**
 * NOTE watch 内部还是调用$watch方法进行创建一个watch
 * @param vm
 * @param k
 * @param handler
 */
function createWatcher(vm, k, handler) {
  let options = {};
  if (typeof handler === "object") {
    const { handler: func, ...rest } = handler;
    handler = func;
    options = rest;
  }
  vm.$watch(k, handler, options);
}

function initWatch(vm) {
  const watch = vm.$options.watch;
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

export { initState, proxy, observe };
