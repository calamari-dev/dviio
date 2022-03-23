/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "/node_modules/(?!xastscript|xast-util-to-.*|ccount|stringify-entities|character-entities-.*).+\\.js",
  ],
};
