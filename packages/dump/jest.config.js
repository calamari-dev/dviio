const ignoredDependencies = ["xastscript", "xast-util-to-string"];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: [
    `/node_modules/(?!${ignoredDependencies.join("|")}).+\\.js`,
  ],
  transform: {
    "^.+\\.jsx?$": [
      "babel-jest",
      { presets: [["@babel/preset-env", { targets: { node: "current" } }]] },
    ],
  },
};
