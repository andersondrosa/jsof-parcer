import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import packageJson from "./package.json" assert { type: "json" };
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
const external = Object.keys(packageJson.peerDependencies || {});

export default {
  input: "src/index.ts",
  output: [
    { name: packageJson.name, dir: "dist", format: "esm" }, //
  ],
  external: (path) => {
    const [dep] = path.split("/");
    if (external.includes(dep)) return true;
    return external.includes(path);
  },
  plugins: [
    terser({
      format: { comments: false, beautify: true },
      compress: false, // Desativa a compressão do código
      mangle: false, // Evita mudança nos nomes das variáveis
    }),
    resolve({
      preferBuiltins: false, // Prefere scripts embutidos
    }),
    json(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.rollup.json" }),
  ],
};
