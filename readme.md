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
