import babel from '@rollup/plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: 'src/index.js',
  output: [{
    format: 'umd',
    file: './dist/ptiming.umd.js',
  }],
  plugins: [
    uglify(),
    babel({
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
      exclude: 'node_modules/**',
    }),
  ],
};
