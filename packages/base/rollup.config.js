import ts from "rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default [
  {
    external: module.require("./package.json").dependencies,
    input: "src/index.ts",
    plugins: [ts(), resolve()],
    output: [
      { file: "dist/index.cjs", format: "cjs" },
      { file: "dist/index.mjs", format: "es" },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [ts(), resolve()],
    output: [
      {
        file: "dist/iife.js",
        format: "iife",
        name: "DVIIO_BASE",
        plugins: [terser({ format: { comments: () => false } })],
      },
    ],
  },
];
