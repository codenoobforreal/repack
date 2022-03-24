[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![repo size](https://img.shields.io/github/repo-size/codenoobforreal/repack)
![build github action](https://img.shields.io/github/workflow/status/codenoobforreal/repack/repack%20ci?label=build%20action)
![master checks state](https://img.shields.io/github/checks-status/codenoobforreal/repack/master?label=master%20checks)
![code size](https://img.shields.io/github/languages/code-size/codenoobforreal/repack)
![license](https://img.shields.io/github/license/codenoobforreal/repack)

# Repack

一个基于 Reactjs 和 Expressjs 的全栈项目模版

- 打包工具选择了 webpack5，使用 babel 处理 ts 和 js 文件；使用内置的 assets module 处理图片和字体文件并做了优化处理（包括有损压缩图片）；使用 react 官方推荐的 react-refresh 来代替 webpack 提供的热加载能力；还有简单的分包。

* 配备了常见的项目基础能力，如规范 commit 信息的写法和对应的 commitlint；eslint、stylelint 和 prittier 的集成；lint-staged 和 husky 的集成；standard-version 的发布能力。

* 前后端都使用 jest 作为基础测试框架，默认都开启了测试覆盖率，前端还配置了官方推荐的 react-testing-library，后端配置了 supertest 作为 api 的测试工具。

* 后端项目建立了简单的项目结构，默认开启了 https（也可以自行更改为 http），还使用了一些常用的第三方中间件，例如日志、安全性和管理工具。

* 配置了 github action，可以视为简单的 ci 流程。

## 命令

```console
npm install            // 安装所有依赖
npm run test           // 运行所有的测试
npm run release        // 发布
npm run start:client   // 使用前端项目的 dev server
npm run serve          // 打包前端项目并使用 express 进行服务
```

**注意需要在根目录进行这些指令**

## 问题

1. 克隆项目下来后，服务端没有必要的 key.pem 和 cert.pem 文件，又不想使用 http 怎么办？使用 openssl 生成对应的私钥和证书即可。

## roadmap

- cli 工具
- 增加必要的功能和能力
