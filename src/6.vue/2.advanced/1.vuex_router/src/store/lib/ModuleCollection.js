/**
 * NOTE module集合
 * 1. 将VUEX中的options中的modules数据进行格式化，为每一个模块创建一个module属性
 * 2. 并递归处理，将每个module里面定义的modules变成该模块的_children模块
 * 如将：
  {
    modules:
    a: {
      state: {},
      modules: {
        c: {
          state: {}
        }
      }
    },
  },
 }
   处理成：{
      a: {
        state: {},
        _children: {
          c: {
           state: {},
           _children: {}
          }
        }
      }
   }
 */
class ModuleCollection {
  constructor(options) {
    this.register([], options);
  }
  register(path, rootModule) {
    // 为每一模块创建一个module属性
    let module = {
      state: rootModule.state,
      _children: {},
      _rawModule: rootModule
    };

    // 没有path，则表示是root module
    if (path.length === 0) {
      this.root = module;
    } else {
      // 存在path，则表示为子module
      // slice(0, -1)是将path中除去了当前module的name
      // 然后使用reduce进行循环，直到从module中找出最深一层的_children属性
      // 如：path => ['a', 'b', 'c']，则表示在this.root._children.a._children.b._children中定义名为c的module
      const parentModule = path
        .slice(0, -1)
        .reduce((parent, cur) => parent._children[cur], this.root);
      parentModule._children[path[path.length - 1]] = module;
    }

    // 遍历当前的rootModule.modules，看是否存在module定义，并格式化
    // 递归将当前模块的下面的modules添加到当前模块的_children里面
    // {
    // modules: {
    //   a: {
    //     modules: {
    //       c: {}
    //     },
    //     state: {}
    //   },
    //   b: {
    //     modules: {
    //       d: {}
    //     }
    //   }
    // }
    // 1 => path: [a], 1.1 => path: [a, c]
    // 2 => path: [b], 2.2 => path: [b, d]
    Object.keys(rootModule.modules || {}).forEach(moduleName => {
      this.register(path.concat(moduleName), rootModule.modules[moduleName]);
    });
  }
}
export default ModuleCollection;
