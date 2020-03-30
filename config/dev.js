const path = require("path");

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
    devServer: {
      port: 8000
    }
  }
};
