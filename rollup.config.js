import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import replace from '@rollup/plugin-replace';

const licenseLine = {
    banner: `/*! getBible Loader v${require('./package.json').version} | https://getbible.net | (c) 2014 - ${new Date().getFullYear()} Llewellyn van der Merwe | MIT License */`
};

const licenseHeader = {
    banner: `/**
 * getBible Loader v${require('./package.json').version}
 * https://getbible.net
 * (c) 2014 - ${new Date().getFullYear()} Llewellyn van der Merwe
 * MIT License
 **/
`};

export default [
    {
        input: 'src/js/getBible.js',
        plugins: [
            license(licenseHeader),
            replace({
                'process.env.DEBUG': true,
                preventAssignment: true,
            })],
        output: {
            file: 'dist/js/getBible.js',
            format: 'umd',
            name: 'getBible',
        },
    },
    {
        input: 'src/js/getBible.js',
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
            }),
            terser(),
            license(licenseLine),
            replace({
                'process.env.DEBUG': false,
                preventAssignment: true,
            })
        ],
        output: {
            file: 'dist/js/getBible.min.js',
            format: 'umd',
            name: 'getBible',
        },
    },
];
