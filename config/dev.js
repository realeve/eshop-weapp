const path = require("path");

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  alias: {
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/utils": path.resolve(__dirname, "..", "src/utils")
  },
  defineConstants: {},
  weapp: {},
  h5: {}
};
