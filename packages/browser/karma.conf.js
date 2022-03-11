/* eslint-disable @typescript-eslint/no-var-requires */
process.env.CHROME_BIN = require("puppeteer").executablePath();
const typescript = require("rollup-plugin-typescript2");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");

module.exports = function (config) {
  config.set({
    frameworks: ["mocha"],
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
      plugins: [typescript(), resolve(), commonjs()],
      output: { format: "iife", name: "tmp", sourcemap: "inline" },
    },
    reporters: ["spec"],
    browsers: ["ChromeHeadless"],
  });
};
