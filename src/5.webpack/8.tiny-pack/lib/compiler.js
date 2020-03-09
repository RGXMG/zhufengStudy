/**
 * NOTE 很重要的一环就是处理加载的文件路径：
 *  1. 在webpack打包的bundle.js中，需要将文件的路径作为module的id，所以每个路径的id都是唯一的；
 *  2. 在书写代码中，require时，一般我们都是书写相对路径的，所以我们需要以入口文件为基准，对每一个相对路径进行处理：
 *    // src/index.js
 *    require('./b.js');   => A路径
 *    // src/a/index.js
 *    require('./b.js');   => B路径
 *    上述俩个虽然加载的是不同的文件，但是写的路径确实一样的，所以我们需要将路径处理，A路径处理为'./src/b.js'作为Id，B路径处理为'./src/a/b.js'
 *    处理方法大致为：从入口文件开始解析，如果存在加载其他文件，则路径统一改为上述格式，然后开始递归进行处理；
 */
const { SyncHook } = require("tapable");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");
// 装es代码转为ast
const esprima = require("esprima");
// 编译ast语法树，洋葱模型，提供enter outer访问
const estraverse = require("estraverse");
// 将ast重新生成es代码
const escodegen = require("escodegen");

class Compiler {
  /**
   * 执行初始化工作
   * 加载config所有的配置参数，初始化插件等等的
   */
  constructor(config) {
    this.options = config;
    // 创建hooks事件
    // 创建各个事件
    // NOTE webpack的hooks中的部分事件
    // NOTE 用户在书写插件的时候自行监听
    this.hooks = {
      entryOption: new SyncHook(["config"]),
      afterPlugin: new SyncHook(["config"]),
      run: new SyncHook(["config"]),
      compile: new SyncHook(["config"]),
      afterCompile: new SyncHook(["config"]),
      emit: new SyncHook(["config"]),
      done: new SyncHook(["config"])
    };

    // NOTE 加载所有插件
    // 执行插件提供的apply方法
    // 将compiler对象传入进去
    const { plugins = [] } = this.options;
    plugins.forEach(plugin => {
      plugin.apply(this);
    });

    // NOTE 1加载完插件之后触发`afterPlugin`事件
    this.hooks.afterPlugin.call(this);
  }

  /**
   * 找到所有的入口文件entry，进行编译
   * 1.编译需要将代码转为ast语法树，将引用路径这些进行替换
   * 2. 解析入口文件的依赖，如果文件中存在依赖，那么则递归寻找依赖
   */
  run() {
    const {
      entry,
      module: { rules },
      output: { path: dist, filename },
      resolveLoader: { modules: loaderModules }
    } = this.options;

    // NOTE 读取当前工作目录,用于拼接完整路径进行加载文件
    // cwdPath：D:\workspace\xmg\frontend\zhufengStudy\src\5.webpack\8.jgpack
    const cwdPath = process.cwd();

    // NOTE 入口文件的id，打包之后从入口文件开始运行
    let entryId;

    //  NOTE 所有模块的对象
    //  格式：{ [模块路径]：[模块内容] }
    const modules = {};

    // NOTE 调用编译事件
    this.hooks.compile.call(this);

    // NOTE 从入口文件开始解析module
    //  更改依赖模块路径，保存所有的模块并加载
    // 第一次设为true，则表明为入口文件
    parseModule(entry, true);

    // NOTE 触发编译完成事件
    this.hooks.afterCompile.call(this);

    // NOTE 调用ejs进行模板输出
    const bundle = ejs.compile(
      fs.readFileSync(path.join(__dirname, "../template/bundle.ejs"), "utf8")
    );

    // NOTE 调用hooks的emit事件
    this.hooks.emit.call(this);

    // 写入文件，bundle.js
    fs.writeFileSync(
      path.join(dist, filename),
      bundle({
        modules,
        entryId
      })
    );

    // NOTE 调用hooks的done事件
    this.hooks.done.call(this);

    /**
     * 解析module
     * 1. 获取模块的内容
     * 2. 将内容匹配对应的loader进行转换
     * 3. 如果存在依赖其他的模块，则递归解析
     * @param modulePath 相对于入口文件的相对路径
     * @param isEntry 是否为入口文件
     */
    function parseModule(modulePath, isEntry) {
      // 文件内容
      let source = fs.readFileSync(path.join(cwdPath, modulePath), "utf8");

      // 获取entryPath的路径
      // 用于拼接entry文件中依赖的其他模块
      const parentPath = modulePath.replace(/\/[^/]+(?!.+)/g, "");

      // TODO 2. 匹配loader进行转换
      /**
       * 颗粒化的接受loader并将按照从后向前的顺序处理loader
       * 1. 加载loader对应的模块
       * 2. 将options传入
       * @param loader
       * @returns {*}
       */
      let handleLoader = loader => {
        const loaders = [];

        /**
         * 根据loaderModules解析loader模块并返回
         * @param loader
         */
        const parseLoaderModule = loader => {
          for (const mp of loaderModules) {
            try {
              // NOTE 此处为了简化操作，直接添加js后缀
              const completedPath = path.join(cwdPath, mp, loader + ".js");
              fs.statSync(completedPath);
              return require(completedPath);
            } catch (e) {
              continue;
            }
          }
          throw new Error(loader + "is not Existed!");
        };

        return (handleLoader = loader => {
          if (loader) {
            loaders.push(loader);
          } else {
            source = loaders.reduceRight(
              (p, n) => (p = parseLoaderModule(n.loader)(p)),
              source
            );
          }
        })(loader);
      };
      const strToLoader = loader =>
        loader.split("!").forEach(i => handleLoader({ loader: i }));
      for (const rule of rules) {
        if (rule.test.test(modulePath)) {
          const { loader, use } = rule;
          // 区分写法
          // loader => string / array;
          if (loader) {
            if (typeof loader === "string") {
              strToLoader(loader);
            } else if (Array.isArray(loader)) {
              loader.forEach(i => handleLoader({ loader: i }));
            }
          } else if (use) {
            if (Array.isArray(use)) {
              use.forEach(({ loader, options }) =>
                handleLoader({ loader, options })
              );
            } else if (typeof use === "string") {
              strToLoader(use);
            } else if (typeof use === "object") {
              handleLoader(use);
            }
          }
          handleLoader();
        }
      }

      // TODO 2. 解析依赖
      // 获取 src/index.js => ./src
      // NOTE 为了简单起见，不处理less文件
      const { source: parseSource, requires } =
        path.extname(modulePath) === ".js"
          ? parse(source, parentPath)
          : { source, requires: [] };

      // 将模块放入modules中
      modules[modulePath] = parseSource;

      console.log(modules);

      // 开始递归解析module
      if (requires) {
        requires.forEach(requireId => {
          // 传入完整的路径
          parseModule(requireId);
        });
      }

      // 将入口文件进行保存
      if (isEntry) {
        entryId = modulePath;
      }
    }

    /**
     * 使用ast语法树解析依赖内容
     * 将更改路径后的依赖和原内容返回
     * @param source
     * @param parentPath 父路径，依赖该模块所在的路径
     */
    function parse(source, parentPath) {
      try {
        const ast = esprima.parse(source);
        // 引入的依赖路径fs.readFileSync
        const requires = [];
        estraverse.replace(ast, {
          enter(node) {
            // 当node.callee.name等于require
            // 将require中的路径替换成相对于cwd的目录
            if (
              node.type === "CallExpression" &&
              node.callee.name === "require"
            ) {
              // 获取路径 ./second
              let name = node.arguments[0].value;
              // 如果文件没有后缀就为value添加js后缀
              if (!path.extname(name)) {
                name += ".js";
              }
              // 改变成完整的路径 => ./src/second.js
              const moduleId =
                "./" + path.join(parentPath, name).replace(/\\/g, "/");

              // 将moduleId加入到依赖requires
              requires.push(moduleId);

              // 替换node.arguments
              node.arguments = [
                {
                  type: "Literal",
                  value: moduleId
                }
              ];
              node.callee.name = "__webpack_require__";
              // estraverse.replace的方法返回一个新node就可以替换以前的node
              return node;
            }
          }
        });
        return { source: escodegen.generate(ast), requires };
      } catch (e) {
        console.log("source:::", source);
      }
    }
  }
}
module.exports = Compiler;
