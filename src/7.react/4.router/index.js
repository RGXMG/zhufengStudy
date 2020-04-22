/**
 * NOTE 路由根本原理
 *  hash： 通过监听window上的hashchange事件进行更换view
 *  history：因为目前现阶段window只实现了onpopstate事件，用于监听页面后退事件，无法监听pushState事件，所以需要重写window.history.pushState,在该事件中去调用自定义的函数，例如自定义的onPushState函数来实现history切换的view更新
 */
