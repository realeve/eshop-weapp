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
