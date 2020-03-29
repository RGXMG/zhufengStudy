/**
 * 将用户传入的数据进行格式化
 * 为每一个路由item创建一个record记录
 * @param routes
 * @param oldPathList
 * @param oldPathMap
 */
export default function createRouteMap(routes, oldPathList, oldPathMap) {
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || Object.create(null);
  // 循环routes，创建record
  routes.forEach(route => {
    createRouteRecord(route, pathList, pathMap);
  });
  return {
    pathMap,
    pathList
  };
}

/**
 * 创建路由记录
 * @param route
 * @param pathList
 * @param pathMap
 * @param parentRecord 父路由的Record记录
 */
function createRouteRecord(route, pathList, pathMap, parentRecord) {
  const routePath = route.path.startsWith("/") ? route.path : `/${route.path}`;
  const path = parentRecord ? `${parentRecord.path}${routePath}` : routePath;
  const record = {
    path,
    component: route.component,
    parent: parentRecord
  };
  // 向pathList以及pathMap中添加这条record
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }
  // 如果有含有children属性，则进行递归处理
  if (Array.isArray(route.children)) {
    route.children.forEach(route => {
      createRouteRecord(route, pathList, pathMap, record);
    });
  }
}
