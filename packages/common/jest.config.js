/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-babel-esm",
  testEnvironment: "node",
  globals: { "ts-jest": { useESM: true } },
  transformIgnorePatterns: [
    "/node_modules/(?!xastscript|xast-util-to-string).+\\.js",
  ],
};
