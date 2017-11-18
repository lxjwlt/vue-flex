module.exports = function (config) {
    config.set({
        frameworks: ['mocha'],
        reporters: ['mocha'],
        browsers: ['ChromeHeadless'],
        files: [
            {
                pattern: '**/*.spec.js',
                watched: false
            }
        ],
        preprocessors: {
            '**/*.spec.js': ['rollup', 'sourcemap']
        },
        rollupPreprocessor: Object.assign({}, require('../rollup.config'), {
            format: 'iife',
            name: 'vueFlex',
            sourcemap: 'inline'
        }),
        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-rollup-preprocessor',
            'karma-sourcemap-loader',
            'karma-chrome-launcher'
        ]
    });
};
