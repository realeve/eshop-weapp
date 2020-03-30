import Taro from "@tarojs/taro";

export const supportWebp = () => {
  const res = Taro.getSystemInfoSync();
  return res.system.includes("Android");
};

const globalData = { webp: supportWebp() };

export function set(key, val) {
  globalData[key] = val;
}

export function get(key) {
  return globalData[key];
}
