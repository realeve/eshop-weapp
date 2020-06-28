const path = require("path");
const hash = require("./hash");
hash.init("dev");

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  alias: {
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/images": path.resolve(__dirname, "..", "src/images"),
    "@/models": path.resolve(__dirname, "..", "src/models"),
    "@/pages": path.resolve(__dirname, "..", "src/pages"),
    "@/services": path.resolve(__dirname, "..", "src/services"),
    "@/styles": path.resolve(__dirname, "..", "src/styles"),
    "@/utils": path.resolve(__dirname, "..", "src/utils")
  },
  defineConstants: {},
  mini: {},
  h5: {
    esnextModules: ["taro-ui"],
    devServer: {
      host: "localhost",
      port: 8000
    },
    router: {
      // https://taro-docs.jd.com/taro/docs/config-detail#h5router
      mode: "browser" // 或者是 'hash'
    },
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module",
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  copy: {
    patterns: [
      { from: "public/", to: "dist/" } // 指定需要 copy 的目录
    ]
  }
};
