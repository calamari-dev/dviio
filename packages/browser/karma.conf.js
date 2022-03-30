/* eslint-disable @typescript-eslint/no-var-requires */
process.env.CHROME_BIN = require("puppeteer").executablePath();
const resolve = require("@rollup/plugin-node-resolve").default;
const ts = require("rollup-plugin-ts");

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    files: [
      "src/**/*.test.ts",
      {
        pattern: "src/__tests__/assets/*.dvi",
        watched: false,
        included: false,
        served: true,
      },
    ],
    proxies: { "/assets/": "/base/src/__tests__/assets/" },
    preprocessors: { "**/*.ts": ["rollup"] },
    rollupPreprocessor: {
      plugins: [resolve(), ts()],
      output: { format: "iife", name: "tmp", sourcemap: "inline" },
    },
    reporters: ["spec"],
    browsers: ["ChromeHeadless"],
  });
};
