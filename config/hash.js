const dayjs = require("../node_modules/dayjs");
const path = require("path");
const fs = require("fs");
const hash = () =>
  Math.random()
    .toString(36)
    .substring(2, 10);

const getFileName = (filename = "/public/version.json") => {
  let str = process.cwd() + filename;
  return str.replace(/\\/g, "/");
};

const data = {
  hash: hash(),
  date: dayjs().format("YYYYMMDD_HHmm")
};

module.exports = {
  init: () => {
    fs.writeFileSync(getFileName(), JSON.stringify(data), "utf8");
  }
};
