// 创建一个服务器
const config = require('./config');
const http = require('http');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const url = require('url');
const util = require('util');
const { promisify } = util;
const mime = require('mime');
const handlebars = require('handlebars');
const zlib = require('zlib');
const crypto = require('crypto');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

process.env.DEBUG='static:*';
// 日志输出模块，控制是否在控制台输出
// 每个debug实例都有一个名字，
// 是否打印取决于环境变量中DEBUG的值是否等于设置的值
// 如const debug = require('debug')('static:app'), DEBUG等于abc时才会输出

// 临时设置：windows通过set DEBUG=static:app设置环境变量的值，也可以使用通配符，如set DEBUG=static:*
// 临时设置：mac下使用export DEBUG=static:app
// 在代码中可以通过process.env.DEBUG设置

// 一般的名称都有其规范，名称由俩个部分组成，static:app
// 第一部分static为项目名称，第二部分为模块名称
const debug = require('debug')('static:app');
function _renderTpl() {
  const tplSrc = fs.readFileSync(path.resolve(__dirname, 'template', 'list.html'), 'utf8');
  return handlebars.compile(tplSrc);
}
class Server {
  constructor(argv) {
    // list模板
    this.listTpl = _renderTpl();
    this.config = Object.assign({}, config, argv);
  }
  start() {
    const server = http.createServer();
    // 强制绑定request的this
    // 避免request的this被篡改
    server.on('request', this.request.bind(this));
    server.listen(this.config.port, () => {
      debug(`server started at ${chalk.green(this.config.host + ':' + this.config.port)}`);
    });
  }

  /**
   * 返回当前目录下所有的文件
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  async request(req, res) {
    // 解析客户端想要访问的路径
    const { pathname } = url.parse(req.url);
    const filepath = path.join(this.config.root, pathname);
    if (pathname === '/favicon.ico') {
      return this.sendError(res);
    }
    try {
      const statePath = await stat(filepath);
      if (statePath.isDirectory()) {
        const files = await readdir(filepath);
          const html = this.listTpl({
            title: pathname,
            files: files.map(file => ({
              name: file,
              url: path.join(pathname, file)
            }))
          });
          res.setHeader('Content-Type', mime.getType(html));
          res.end(html);
      } else {
        this.sendFile(req, res, filepath, statePath);
      }
    } catch (e) {
      // util.inspect将对象转为字符串，
      // 因为在node中，可能有的对象打印出来就是[Object]
      debug(util.inspect(e));
      this.sendError(res);
    }
  }
  async sendFile(req, res, filepath, statePath) {
    // 处理缓存
    const result = await this.handleCache(req, res, filepath, statePath);
    if (result) {
      res.writeHead(304);
      res.end();
      return;
    }
    // 设置header Content-Type
    res.setHeader('Content-Type', mime.getType(filepath));
    const rs = fs.createReadStream(filepath);
    // 处理文件压缩
    const encoding = this.getEncoding(req, res);
    if (encoding) {
      rs.pipe(encoding).pipe(res);
      // fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
    } else {
      rs.pipe(res);
    }
  };
  sendError(res) {
    res.statusCode = 500;
    res.end('there is some wrong in the server! please try later!');
  }

  /**
   * 处理压缩编码
   * 返回转换流，用于压缩
   * @param req
   * @param res
   */
  getEncoding(req, res) {
    // 获取客户端支持的编码格式 gzip, deflate
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding) {
      return null;
    }
    if (acceptEncoding.match(/\bgzip\b/)) {
      res.setHeader('Content-Encoding', 'gzip');
      return zlib.createGzip();
    }
    if (acceptEncoding.match(/\bdeflate\b/)) {
      res.setHeader('Content-Encoding', 'deflate');
      return zlib.createDeflate();
    }
  }

  /**
   * 处理缓存
   * 1. last-modify / if-modified-since
   * 2. ETag / if-None-Match
   * 3. cache-Control: private、public、max-age、no-cache、no-store
   * @param req
   * @param res
   * @param filepath
   * @param statePath
   */
  handleCache(req, res, filepath, statePath) {
    try {
      res.setHeader('Cache-Control', 'private,max-age=30');
      res.setHeader('Expires', new Date(Date.now() + 30 * 1000).toUTCString());
      const ifModifiedSince = req.headers['if-modified-since'];
      const ifNoneMatch = req.headers['if-none-match'];
      // 获取当前last-modified
      const currentCtime = statePath.ctime.toUTCString();
      // 比较ETag 摘要
      const hash = crypto.createHash('md5');
      const cr = fs.createReadStream(filepath);
      return new Promise(resolve => {
        cr.on('data', function (data) {
          hash.update(data);
        });
        // 进行偷懒比较
        cr.on('end', function () {
          const hashHex = hash.digest('hex');
          // 设置缓存
          res.setHeader('ETag', hashHex);
          res.setHeader('Last-Modified', currentCtime);
          if (ifModifiedSince && currentCtime !== ifModifiedSince) {
            return resolve(false);
          }
          if (ifNoneMatch && ifNoneMatch !== hashHex) {
            return resolve(false);
          }
          if (!ifModifiedSince && !ifModifiedSince) {
            return resolve(false);
          }
          resolve(true);
        });
      });
    } catch (e) {
      this.sendError(e)
    }

  }
}
module.exports = Server;