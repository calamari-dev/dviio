import ts from "rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
const pkg = module.require("./package.json");

export default [
  {
    external: Object.keys(pkg.dependencies || {}),
    input: "src/index.ts",
    plugins: [resolve(), ts()],
    output: [
      { file: "dist/index.cjs", format: "cjs" },
      { file: "dist/index.mjs", format: "es" },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [resolve(), ts()],
    output: [
      {
        file: "dist/iife.js",
        format: "iife",
        name: "DVIIO_COMMON",
        plugins: [terser()],
      },
    ],
  },
];
