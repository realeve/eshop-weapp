# 已知问题

1.一个 tsx 文件不要引用多个 scss 文件，只能引用一个

> 解决方案：在 scss 文件中相互引用注入到 tsx 中

## bad

```tsx
// page.tsx

import "./page.scss";
import "@/components/CCard/index.scss";
// 业务代码
```

## good

```tsx
// page.tsx

import "./page.scss";
// 业务代码
```

```scss
// page.scss
@import "@/components/CCard/index.scss";
```

2. 多个 tsx 不共同引用同一个 scss 文件；

> 在小程序中每个 tsx 编译独自的 scss 文件，所以不要在不同页面中共用同一个 scss，每个页面的 scss 独立编写，可在 scss 中引用。

## bad

```tsx
// page1.tsx
import "./page1.scss";

// page2.tsx
import "./page1.scss";
```

## good

```tsx
// page1.tsx
import "./page1.scss";

// page2.tsx
import "./page2.scss";
```

3. useSetState 需要单独引用，不走 @components/

```tsx
// bad
import { useSetState } from "@/components/";

// good
import useSetState from "@/components/hooks/useState";
```

4.scss 样式名用 BEM 的方式

```scss
// bad
.specialPage {
}
.special-page {
}

// good
.special_page {
}
```

5.不要用 <kbd>id</kbd> 作为参数名

> id 作为 html 保留属性，传入参数 _id={goodsId}_ ，等价于 jQuery 中 \$('#goodsId')。

```tsx
// bad
<DContent id={id} />

// god
<DContent goods_id={id} />
```

6.Taro 已知 bug

命令行中出现以下信息时，删除 node 实例重新 npm run dev:weapp 即可

```bash
Maximum call stack size exceeded
```

---

## 设计稿：

[https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800](https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800)

[https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000](https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000)

[https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s2821abf765156350448300](https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s2821abf765156350448300)

## TODO

- [ ] 调整地址组件
