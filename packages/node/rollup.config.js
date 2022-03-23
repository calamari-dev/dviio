import ts from "rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
const pkg = module.require("./package.json");

export default {
  external: pkg.dependencies,
  input: "src/index.ts",
  plugins: [ts(), resolve()],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
};
