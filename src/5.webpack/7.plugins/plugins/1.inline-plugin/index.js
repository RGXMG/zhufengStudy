/**
 * 通过监听html-webpack-plugin提供的事件，进行更改该事件的数据，将js文件直接内联到html文件中；
 */

class InlinePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('compilation', function(compilation) {
      // htmlWebpackPluginAlterAssetTags是html-webpack-plugin添加上去的
      // 是一个异步事件
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('changeTags', function (data, callback) {
        // console查看该事件返回的data数据
        // console.log('data:::', data)：body: [ { tagName: 'script', closeTag: true, attributes: [Object] } ]
        data.body.forEach(ele => {
          if (ele.tagName === 'script') {

            // console查看attributes中的数据：{ type: 'text/javascript', src: 'bundle.js' }
            // console.log(ele.attributes);

            // 缓存src值
            // 这样可以直接从compilation.assets中获取文件的source值便于后面直接内联
            const src = ele.attributes.src;

            // 直接删除位于attributes的src属性
            // 这样html-webpack-plugin就不会在script标签中生成src属性
            delete ele.attributes.src;

            // 缓存获取位于compilation.assets中的src数据
            // 调用source()方法拿到数据
            const source = compilation.assets[src].source();

            // 因为是直接将js文件内联到script中，所以就没有必要生成该js文件了
            // 直接删除compilation[src]，这样就不会生成
            delete compilation.assets[src];

            // html-webpack-plugin内部会调用该属性
            ele.innerHTML = source;
          }
        });
        // 将data返回，供其他注册该事件的其他plugin使用
        callback(null, data);
      })
    });
  }
}
module.exports = InlinePlugin;