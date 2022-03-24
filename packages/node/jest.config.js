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
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  transformIgnorePatterns: [
    `/node_modules/(?!${ignoredDependencies.join("|")}).+\\.js`,
  ],
};
