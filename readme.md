# eshop-weapp

```bash
npm run dev:h5 // h5页面

npm run addpage 页面英文名称 // 添加一个页面，自动初始化相关数据

```

## ui

UI 页参考：[https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s7c737c8a73157067396900](https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s7c737c8a73157067396900)

[https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000](https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000)

[https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800](https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800)

```bash
git branch -a  #查看所有分支
git branch -v  # 当前分支
git checkout -b test origin/test  # 将test分支下载到本地test

# 分支合并到dev
git checkout dev
git pull origin dev
git merge <master | zddq | wendy |  other users>
git push origin dev


# 拉取dev信息到开发者本地分支
git checkout zddq
git pull origin dev
git merge zddq
git push origin zddq


# 合并某分支到dev

git checkout dev
git pull origin wendy
git merge wendy
git push origin dev
```

---

:bug:

## You have not concluded your merge (MERGE_HEAD exists)

解决办法一:保留本地的更改,中止合并->重新合并->重新拉取

```bash
git merge --abort
git reset --merge
git pull
```

##error: You have not concluded your merge (MERGE_HEAD exists).
hint: Please, commit your changes before merging.
fatal: Exiting because of unfinished merge.

```bash
git fetch --all
git reset --hard origin/dev

```

# doc

1. taro ui [https://taro-ui.jd.com/#/](https://taro-ui.jd.com/#/)
2. taro [https://taro.aotu.io](https://taro.aotu.io)

3. scss[https://www.sass.hk/docs/](https://www.sass.hk/docs/)

## 编译到微信小程序报错

> no such file or directory, open '项目目录 \node_modules\taro-ui\dist\weapp\style\themes\purple.scss'

把整个 style 目录拷到对应目录

## 🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛🐛 修复小程序 axios 引用报错

[https://github.com/fjc0k/taro-axios](https://github.com/fjc0k/taro-axios)

```
> 因为 Taro 不支持解析 package.json 里的 browser 属性，导致所有使用了该特性的包都可能无法在 Taro 里正常运行。不幸的是，axios 就是其中之一。

> 于是，taro-axios 预先解析了 axios 包中的 browser 属性并提供了 Taro 版的请求适配器后，将之打包出了一个 Taro 可用的版本。

> 也就是说，taro-axios 只是 axios 的 Taro 重制版，并非是为 Taro 仿写了一个 axios。axios 提供什么，taro-axios 也就提供什么特性
```
