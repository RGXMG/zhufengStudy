#! /usr/bin/env node
const path = require("path");
const fs = require("fs");
const Compiler = require("../lib/compiler");
// 获取工作目录
const cwd = process.cwd();
// 获取配置文件
const configPath = path.join(cwd, "webpack.config.js");
const config = require(configPath);
const compiler = new Compiler(config);
compiler.run();
