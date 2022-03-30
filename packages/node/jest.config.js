const ignoredDependencies = [
  "xastscript",
  "xast-util-to-xml",
  "xast-util-to-string",
  "ccount",
  "stringify-entities",
  "character-entities-legacy",
  "character-entities-html4",
];

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
