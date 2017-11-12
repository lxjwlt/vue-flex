const pkg = require('./package.json');
const isMin = process.env.NODE_ENV === 'min';
const isDoc = process.env.NODE_ENV === 'doc';
const targetDir = isDoc ? 'docs/static' : 'dist';

function d (arr) {
    return arr.filter((v) => v);
}

module.exports = {
    banner: [
        '/**',
        ` * ${pkg.name} v${pkg.version}`,
        ` * (c) 2017-present ${pkg.author}`,
        ` * Released under the ${pkg.license} license`,
        ` * ${pkg.repository.url}`,
        ' */'
    ].join('\n'),
    input: 'src/index.js',
    output: {
        file: `${targetDir}/${pkg.name}${isMin ? '.min' : ''}.js`,
        format: 'umd',
        name: 'vue-flex'
    },
    plugins: d([
        require('rollup-plugin-commonjs')(),
        require('rollup-plugin-node-resolve')(),
        require('rollup-plugin-postcss')({
            plugins: d([
                require('autoprefixer')({
                    browsers: [
                        'ie >= 10',
                        'chrome > 21'
                    ]
                }),
                isMin ? require('cssnano')() : null
            ])
        }),
        isMin ? require('rollup-plugin-uglify')({
            output: {
                comments: new RegExp(`${pkg.name}\\sv\\d+\\.\\d+\\.\\d+`)
            }
        }) : null
    ])
};
