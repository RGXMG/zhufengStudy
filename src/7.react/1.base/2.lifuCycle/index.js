/**
 * NOTE 生命周期
 *  1.
 *  2.
 *  3. 旧版：componentWillReceiveProps 方法第一次不会执行，只有当收到新的props才会执行
 *  4. 在生命周期中调用ajax，推荐使用componentDidMount()中去调用，而不推荐在componentWillMount中：
 *     使用componentWillMount的普遍理由：
 */
