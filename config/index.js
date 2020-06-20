const path = require("path");

// NOTE 在 sass 中通过别名（@ 或 ~）引用需要指定路径
const sassImporter = function(url) {
  if (url[0] === "~" && url[1] !== "/") {
    return {
      file: path.resolve(__dirname, "..", "node_modules", url.substr(1))
    };
  }

  // 处理 @符号
  // '@/styles/dasd'.match(/^@\/(.*)/) === 'styles/dasd'
  const reg = /^@\/(.*)/;

  return {
    file: reg.test(url)
      ? path.resolve(__dirname, "..", "src/", url.match(reg)[1])
      : url
  };
};

const config = {
  projectName: "weapp",
  date: "2020-2-10",
  alias: {
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/images": path.resolve(__dirname, "..", "src/images"),
    "@/models": path.resolve(__dirname, "..", "src/models"),
    "@/pages": path.resolve(__dirname, "..", "src/pages"),
    "@/services": path.resolve(__dirname, "..", "src/services"),
    "@/styles": path.resolve(__dirname, "..", "src/styles"),
    "@/utils": path.resolve(__dirname, "..", "src/utils")
  },
  designWidth: 750,
  deviceRatio: {
    "640": 2.34 / 2,
    "750": 1,
    "828": 1.81 / 2
  },
  sourceRoot: "src",
  outputRoot: "dist",
  // sass: {
  //   importer: sassImporter
  // },
  babel: {
    sourceMap: true,
    presets: [
      [
        "env",
        {
          modules: false
        }
      ]
    ],
    plugins: [
      "transform-decorators-legacy",
      "transform-class-properties",
      "transform-object-rest-spread",
      [
        "transform-runtime",
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: "babel-runtime"
        }
      ]
    ]
  },
  // plugins: {
  //   sass: {
  //     importer: sassImporter
  //   }
  // },
  defineConstants: {},
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["taro-ui"],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    },
    sassLoaderOption: {
      importer: sassImporter
    },
    router: {
      // https://taro-docs.jd.com/taro/docs/config-detail#h5router
      mode: "browser" // 或者是 'hash'
    }
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
