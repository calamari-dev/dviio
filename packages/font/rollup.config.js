import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    external: ["core-js-pure/actual/structured-clone"],
    input: "src/index.ts",
    plugins: [commonjs(), resolve(), ts()],
    output: [{ file: "dist/index.cjs", format: "cjs" }],
  },
  {
    input: "src/index.ts",
    plugins: [commonjs(), resolve(), ts()],
    output: [{ file: "dist/index.mjs", format: "es" }],
  },
  {
    input: "src/index.ts",
    plugins: [commonjs(), resolve(), ts()],
    output: [
      {
        file: "dist/iife.js",
        format: "iife",
        name: "DVIIO_BASE",
        plugins: [terser()],
      },
    ],
  },
];
