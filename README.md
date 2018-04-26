## 前言

<p>这是一个基于react 开发的一个音乐app，灵感来至于 <a href="https://github.com/ustbhuangyi">@ustbhuangyi</a> 黄老师的vue music-app,对此表示感谢。</p>
<p>感谢 api server 提供者<a href="https://github.com/Binaryify/NeteaseCloudMusicApi/commits?author=Binaryify ">Binaryify</a></p>
<p>api地址 <a rel="nofollow" href="https://binaryify.github.io/NeteaseCloudMusicApi">https://binaryify.github.io/NeteaseCl…</a></p>


## 效果预览
<p style="text-align:center;">
  <img src="http://sunshinejy.cn/github/20180425_092859.gif"/>
</p>

## 安装

```shell
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git
$ npm install
```

## 运行

```shell
$ node app.js
```

服务器启动默认端口为 3000,若不想使用 3000 端口,可使用以下命令: Mac/Linux

```shell
$ PORT=4000 node app.js
```

windows 下使用 git-bash 或者 cmder 等终端执行以下命令:

```shell
$ set PORT=4000 && node app.js
```

## Docker 容器运行

```shell
docker pull pengxiao/netease-music-api
docker run -d -p 3000:3000 pengxiao/netease-music-api
```

## 使用文档

[文档地址](https://binaryify.github.io/NeteaseCloudMusicApi)

![文档](https://raw.githubusercontent.com/Binaryify/NeteaseCloudMusicApi/master/static/docs.png)

## 更新日志

[changelog](https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/CHANGELOG.MD)

## 单元测试

```shell
$ npm test
```

![单元测试](https://raw.githubusercontent.com/Binaryify/NeteaseCloudMusicApi/master/static/screenshot1.png)
![单元测试](https://raw.githubusercontent.com/Binaryify/NeteaseCloudMusicApi/master/static/screenshot2.png)

## License

[The MIT License (MIT)](https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/LICENSE)


