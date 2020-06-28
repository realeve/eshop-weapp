const dayjs = require("../node_modules/dayjs");
const path = require("path");
const fs = require("fs");

const hash = () =>
  Math.random()
    .toString(36)
    .substring(2, 10);

const getFileName = env => {
  let filename = `/public/version${env}.json`;
  let str = process.cwd() + filename;
  return str.replace(/\\/g, "/");
};

module.exports = {
  init: (env = "") => {
    let file = "";
    try {
      file = fs.readFileSync(getFileName(env), "utf8");
    } catch (e) {
      file = '{"version":"1.0"}';
    }
    file = JSON.parse(file);
    let preVersion = Number(file.version);
    const data = {
      version: String(preVersion + 0.1),
      hash: hash(),
      date: dayjs().format("YYYY-MM-DD HH:mm")
    };
    fs.writeFileSync(getFileName(env), JSON.stringify(data), "utf8");
  }
};
