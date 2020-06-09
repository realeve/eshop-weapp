import { Component } from "@tarojs/taro";

const objectToString = (style: object | string): string => {
  if (style && typeof style === "object") {
    let styleStr = "";
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      styleStr += `${lowerCaseKey}:${style[key]};`;
    });
    return styleStr;
  } else if (style && typeof style === "string") {
    return style;
  }
  return "";
};

export default class AtComponent<P = {}, S = {}> extends Component<P, S> {
  static options = {
    addGlobalClass: true
  };

  /**
   * 合并 style
   * @param {Object|String} style1
   * @param {Object|String} style2
   * @returns {String}
   */
  mergeStyle(
    style1: object | string,
    style2: object | string
  ): object | string {
    if (
      style1 &&
      typeof style1 === "object" &&
      style2 &&
      typeof style2 === "object"
    ) {
      return Object.assign({}, style1, style2);
    }
    return objectToString(style1) + objectToString(style2);
  }
}

export function uuid(len = 8, radix = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  const value: string[] = [];
  let i = 0;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    /* eslint-disable-next-line */
    value[8] = value[13] = value[18] = value[23] = "-";
    value[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16);
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return value.join("");
}

export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}