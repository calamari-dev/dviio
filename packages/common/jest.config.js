const ignoredDependencies = ["xastscript", "xast-util-to-string"];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  transformIgnorePatterns: [
    `/node_modules/(?!${ignoredDependencies.join("|")}).+\\.js`,
  ],
};
