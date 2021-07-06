/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 12:16
 *
 */
import {
  LOAD_ERROR,
  LOAD_RESOURCE_CODE,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  SKIP_BECAUSE_BROKEN
} from "../application/apps.helper";
import { smellLikeAPromise, flattenLifecycleArray, getProps } from "./helper";
import { ensureAppTimeouts } from "../application/timeout";

/**
 *
 * 通过微任务加载子应用，其实singleSpa中很多地方都用了微任务
 * 这里最终是return了一个promise出行，在注册了加载子应用的微任务
 * 概括起来就是：
 *  更改app.status为LOAD_SOURCE_CODE => NOT_BOOTSTRAP，当然还有可能是LOAD_ERROR
 *  执行加载函数，并将props传递给加载函数，给用户处理props的一个机会,因为这个props是一个完备的props
 *  验证加载函数的执行结果，必须为promise，且加载函数内部必须return一个对象
 *  这个对象是子应用的，对象中必须包括各个必须的生命周期函数
 *  然后将生命周期方法通过一个函数包裹并挂载到app对象上
 *  app加载完成，删除app.loadPromise
 * 加载App的loadFunction
 * 完成之后：
 * 1. 校验和处理App的生命周期函数
 * 2. 处理生命周期函数的超时逻辑
 * @param app
 * @returns {Promise<never>|Promise<any>}
 */
export function toLoadPromise(app) {
  if (app.status !== NOT_LOADED) {
    return Promise.resolve(app);
  }

  // 设置当前App的状态为加载代码中
  app.status = LOAD_RESOURCE_CODE;

  // 加载对应的源码，并传入props
  const loadPromise = app.loadFunction(getProps(app));

  // 加载源码的函数必须返回一个promise
  if (!smellLikeAPromise(loadPromise)) {
    app.status = SKIP_BECAUSE_BROKEN;
    return Promise.reject(new Error(""));
  }

  // 获取app的配置
  // 生命周期的处理
  // 生命周期的超时处理
  // 设置LOAD_ERROR的处理
  return loadPromise
    .then(appConfig => {
      if (appConfig && typeof appConfig !== "object") {
        throw new Error("");
      }
      // 验证生命周期 bootsrap mout unmout
      let errors = [];
      ["bootstrap", "mount", "unmount"].forEach(lifecycle => {
        if (!appConfig[lifecycle]) {
          errors.push(`${lifecycle} not existed！`);
        }
      });

      // 判断生命周期是否合法
      if (errors.length) {
        app.status = SKIP_BECAUSE_BROKEN;
        console.error(errors);
        return;
      }

      // 加载完成，改变app的状态
      app.status = NOT_BOOTSTRAPPED;

      app.bootstrap = flattenLifecycleArray(
        appConfig.bootstrap,
        `${app.name} bootstrap`
      );
      app.mount = flattenLifecycleArray(appConfig.mount, `${app.name} mount`);
      app.unmount = flattenLifecycleArray(
        appConfig.unmount,
        `${app.name} unmount`
      );

      // 将appConfig上面的timeouts配置添加到当前的App上
      // 使用ensureTimeout方法保证AppConfig上面存该属性
      app.timeouts = ensureAppTimeouts(appConfig);

      return app;
    })
    .catch(e => {
      app.status = LOAD_ERROR;
      console.log(e);
      return app;
    });
}
