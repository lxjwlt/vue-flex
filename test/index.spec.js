'use strict';

var assert = require('chai').assert;
var Vue = require('vue/dist/vue');
var vueFlex = require('../src/index');

Vue.config.silent = true;
Vue.config.productionTip = false;
Vue.config.devtools = false;

function comp (name, data) {
    Vue.use(vueFlex);
    return (new (Vue.extend(Vue.component(name)))({
        propsData: data
    })).$mount();
}

function newApp (config) {
    Vue.use(vueFlex);

    let app = new Vue(config);

    app.$mount();

    return app;
}

function prefixCss (config) {
    config.msFlexPositive = config.flexGrow;

    config.msFlexNegative = config.flexShrink;

    config.msFlexPreferredSize = config.flexBasis;

    return config;
}

describe('vue-flex', () => {
    it('exports is no omission', function () {
        assert.ok(vueFlex.flex);
        assert.ok(vueFlex.flexItem);
        assert.ok(vueFlex.install);
        assert.strictEqual(Object.keys(vueFlex).length, 3);
    });

    it('install and register component successfully', function () {
        Vue.use(vueFlex);
        assert.ok(Vue.component('flex'));
        assert.ok(Vue.component('flex-item'));
    });

    describe('flex component', () => {
        it('flex class name', function () {
            let flexComp = comp('flex', {
                flexDirection: 'column',
                flexWrap: 'wrap',
                justifyContent: 'stretch',
                alignContent: 'flex-end',
                alignItems: 'center'
            });

            assert.include(flexComp.cls, 'vue-flex--flex-direction-column');
            assert.include(flexComp.cls, 'vue-flex--flex-wrap-wrap');
            assert.include(flexComp.cls, 'vue-flex--justify-content-stretch');
            assert.include(flexComp.cls, 'vue-flex--align-content-flex-end');
            assert.include(flexComp.cls, 'vue-flex--align-items-center');
        });

        it('gutter', function () {
            let flexComp = comp('flex', {
                gutter: 10
            });

            assert.include(flexComp.css, {
                margin: '-5px'
            });
        });
    });

    describe('flex-item component', () => {
        it('order', function () {
            let flexComp = comp('flex-item', {
                order: 3
            });

            assert.include(flexComp.css, {
                msFlexOrder: 3,
                order: 3
            });
        });
        it('class name', function () {
            let flexComp = comp('flex-item', {
                alignSelf: 'flex-end'
            });

            assert.strictEqual(flexComp.cls, 'vue-flex-item--align-self-flex-end');
        });
        it.only('automate longhand of flex props', function () {
            let app = newApp({
                template: '<flex ref="flex"><flex-item ref="flexItem"></flex-item></flex>'
            });

            let flexComp = app.$refs.flexItem;
            let flexboxComp = app.$refs.flex;

            flexComp.$props.flex = 'auto';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = 'initial';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '0',
                flexShrink: '1',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = 'none';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '0',
                flexShrink: '0',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = '2';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '2',
                flexShrink: '1',
                flexBasis: '0%'
            }));

            flexComp.$props.flex = '2.5';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '2.5',
                flexShrink: '1',
                flexBasis: '0%'
            }));

            flexComp.$props.flex = '10px';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '10px'
            }));

            flexComp.$props.flex = '10.05%';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '10.05%'
            }));

            flexComp.$props.flex = '1 30%';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '30%'
            }));

            flexComp.$props.flex = '1 auto';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = '1 30px';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '30px'
            }));

            flexComp.$props.flex = 'auto 1';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = 'auto 10px';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '10px',
                flexShrink: '1',
                flexBasis: 'auto'
            }));

            flexComp.$props.flex = '1 1 0';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '0px'
            }));

            flexComp.$props.flex = '10px 1 0';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '0',
                flexBasis: '10px'
            }));

            flexComp.$props.flex = 0;
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '0',
                flexShrink: '1',
                flexBasis: '0%'
            }));

            flexComp.$props.flex = 'inherit';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: 'inherit',
                flexShrink: 'inherit',
                flexBasis: 'inherit'
            }));

            flexComp.$props.flex = 'unset';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: 'unset',
                flexShrink: 'unset',
                flexBasis: 'unset'
            }));

            flexComp.$props.flex = 'max-content';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'max-content'
            }));

            flexComp.$props.flex = 'calc(100px - 20px) 1 22';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '22',
                flexBasis: 'calc(100px - 20px)'
            }));

            flexComp.$props.flex = '1 2 calc(calc(50% + 10px) - 20px)';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '2',
                flexBasis: 'calc(calc(50% + 10px) - 20px)'
            }));

            flexboxComp.$props.flexDirection = 'column';
            flexComp.$props.flex = '10px';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '10px'
            }));
            flexboxComp.$props.flexDirection = 'row';

            /**
             * error flex
             */
            flexComp.$props.flex = '';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '0%'
            }));

            flexComp.$props.flex = '1 1 10px 1';
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '0%'
            }));

            flexComp.$props.flex = true;
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: 'true'
            }));

            flexComp.$props.flex = undefined;
            assert.deepStrictEqual(flexComp.cFlex, prefixCss({
                flexGrow: '1',
                flexShrink: '1',
                flexBasis: '0%'
            }));
        });
        it('margin from gutter', function () {
            Vue.use(vueFlex);
            let app = new Vue({
                template: '<flex gutter="30"><flex-item ref="item"></flex-item></flex>'
            });

            app.$mount();

            assert.include(app.$refs.item.css, {
                margin: '15px'
            });
        });
    });
});
