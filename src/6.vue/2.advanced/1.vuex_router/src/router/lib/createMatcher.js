/**
 * 创建匹配器
 * 在该方法中对routes数据进行格式化处理，
 * 并返回匹配方法match以及路由的添加方法addRoutes
 * @param routes
 * @returns {{match: match, addRoutes: addRoutes}}
 */
import createRouteMap from "./createRouteMap";

export default function createMatcher(routes) {
  // 创建路由的映射表
  // 返回路由list以及item的映射
  // pathList: ['/', '/home', '/about']
  // pathMap: { '/': item, '/home': item, '/about': item, }
  const { pathList, pathMap } = createRouteMap(routes);
  console.log(pathList, pathMap);
  /**
   * 动态路由的添加方法
   * 将新加进来的路由与oldPathList与oldPathMap进行合并
   * @param routes
   */
  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap);
  }
  function match(location) {
    return pathMap[location];
  }
  return {
    match,
    addRoutes
  };
}
