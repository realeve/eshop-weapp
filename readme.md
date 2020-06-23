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

7.setStorage 可以直接存 obj,但建议用 JSON.stringify 转为字符串

否则在解析时如果报错，会导致 useFetch 无限加载

8. **用于 page 显示的 tsx 文件【在 app.tsx 注册的页面】，不要导出多个元素（page 本身、数据处理函数、子组件等**，否则会导致调用的页面、被调用的页面出现不可理解的错误：

> 处理方法：将需要导出的内容单独写到一个文件中，不要同 page 视图页面放在一起

注意： 此处的元素同时包含子组件，将子组件写在一个 page 中导出也会导致同样的情况；

```tsx
// bad

export handleAddres = res=>{
    //
    return res;
}
export default ()=>{
    return <View>adsf</View>
}

// good
import {handleAddress}from './lib';
export default ()=>{
    return <View>adsf</View>
}

```

---

## 设计稿：

[https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800](https://org.modao.cc/app/3a350e83db597fb8785d218dc344f770#screen=s739e44b9ee156395644800)

[https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000](https://org.modao.cc/app/775739963b07c31029e1c174b541b62f#screen=sd86c4df7a3156232028000)

[https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s2821abf765156350448300](https://org.modao.cc/app/cf2e27c73e48b63f27acfdb837086ecd#screen=s2821abf765156350448300)

## TODO

- [-] 调整地址组件

## webp

### webp

[https://static.ccgold.cn/image/e5/e3/e5e320f8577ce78a62f7d5ec9fc976a7.jpg?x-oss-process=image/format,webp](https://static.ccgold.cn/image/e5/e3/e5e320f8577ce78a62f7d5ec9fc976a7.jpg?x-oss-process=image/format,webp)

### resize

[https://statictest.ccgold.cn/image/e9/68/e968e2a1ade28122b175aa77e9a5ddfa.jpg?x-oss-process=image/resize,limit_0,m_fill,w_250,h_250/format,webp](https://statictest.ccgold.cn/image/e9/68/e968e2a1ade28122b175aa77e9a5ddfa.jpg?x-oss-process=image/resize,limit_0,m_fill,w_250,h_250/format,webp)

### 首屏优化

- 2 组 6 宫格
- 1 组 3\*1 slide
- 1 组 2\*1 slide
- 1 组 1 全屏图

共 18 张图：2.3M

合理的大小：1.4M

合理的大小+webp: 287kb

结论，优化后 287kb/2.3M = 1/8.2 约 八分之一

---

# mock

http://47.110.150.104:3000/project/30/interface/api/516
